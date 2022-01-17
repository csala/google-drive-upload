const core = require('@actions/core');
const upload = require('./upload');

const serviceAccountKeyJSON = core.getInput('service_account_key_json', { required: true });
const folderId = core.getInput('folder_id', { required: true });
const localPath = core.getInput('local_path', { required: true });
const remoteFilename = core.getInput('remote_filename', { required: false });
const subfolderName = core.getInput('subfolder_name', { required: false });

const overwrite = JSON.parse(core.getInput('overwrite', { required: false }));
const convert = JSON.parse(core.getInput('convert', { required: false }));

async function run() {
  try {
    const drive = await upload.getDriveClient(serviceAccountKeyJSON);
    const finalFolderId = await upload.getFolderId(drive, folderId, subfolderName);
    await upload.uploadFile(drive, finalFolderId, localPath, remoteFilename, overwrite, convert);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
