const core = require('@actions/core');
const fs = require('fs');
const path = require('path');
const {google} = require('googleapis');

let getDriveClient = function (serviceAccountKeyJSON) {
  const credentials = JSON.parse(serviceAccountKeyJSON);
  const scopes = ['https://www.googleapis.com/auth/drive.file'];
  const auth = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    scopes,
  );
  return google.drive({ version: 'v3', auth });
};

let getFolderId = async function (drive, folderId, subfolderName) {
  if (!subfolderName) {
    return folderId;
  }

  const query = `name='${subfolderName}' and '${folderId}' in parents
                 and mimeType = 'application/vnd.google-apps.folder'`;
  const { data: { files } } = await drive.files.list({
    q: query,
    fields: 'files(id)',
  });

  if (files.length > 1) {
    throw new Error(`More than one folder named ${subfolderName} found.`);
  }
  if (files.length === 1) {
    return files[0].id;
  }

  const subfolderMetadata = {
    name: subfolderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [folderId],
  };
  const { data: { id: subfolderId } } = await drive.files.create({
    resource: subfolderMetadata,
    fields: 'id',
  });

  return subfolderId;
}

let getFileId = async function (drive, overwrite, filename, folderId) {
  if (!overwrite) {
    return null;
  }

  const query = `name='${filename}' and '${folderId}' in parents
           and mimeType != 'application/vnd.google-apps.folder'`;
  const { data: { files } } = await drive.files.list({
    q: query,
    fields: 'files(id)',
  });

  if (files.length > 1) {
    throw new Error(`More than one file named ${filename} found.`);
  }
  if (files.length === 1) {
    return files[0].id;
  }

  return null;
}

let getMimeTypes = async function (localPath, convert) {
  let localMimeType;
  let remoteMimeType;

  if (convert) {
    if (localPath.endsWith('.xlsx')) {
      localMimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      remoteMimeType = 'application/vnd.google-apps.spreadsheet';
    } else if (localPath.endsWith('.csv')) {
      localMimeType = 'text/csv';
      remoteMimeType = 'application/vnd.google-apps.spreadsheet';
    }
  }

  return [localMimeType, remoteMimeType];
}

let uploadFile = async function (drive, folderId, localPath, remoteFilename, overwrite, convert) {
  if (!remoteFilename) {
    remoteFilename = path.basename(localPath);
    if (convert) {
      if (remoteFilename.endsWith('xlsx')) {
        remoteFilename = remoteFilename.slice(0, -5);
      } else if (remoteFilename.endsWith('csv')) {
        remoteFilename = remoteFilename.slice(0, -4);
      }
    }
  }

  const mimeTypes = await getMimeTypes(localPath, convert)
  const fileId = await getFileId(drive, overwrite, remoteFilename, folderId);

  const fileData = {
    mimeType: mimeTypes[0],
    body: fs.createReadStream(localPath),
  };

  if (fileId === null) {
    core.info(`Creating ${remoteFilename} in folder ${folderId}.`);
    const fileMetadata = {
      name: remoteFilename,
      parents: [folderId],
      mimeType: mimeTypes[1],
    };

    drive.files.create({
      resource: fileMetadata,
      media: fileData,
      uploadType: 'multipart',
      fields: 'id',
    });
  } else {
    core.info(`Updating ${remoteFilename} from folder ${folderId}.`);
    drive.files.update({
      fileId,
      media: fileData,
    });
  }
}

exports.getDriveClient = getDriveClient;
exports.getFolderId = getFolderId;
exports.getFileId = getFileId;
exports.uploadFile = uploadFile;
