const upload = require('./upload');
const fs = require('fs');
const {drive_v3} = require('googleapis');
const readOpts = {encoding:'utf8', flag:'r'};

const serviceAccountKeyJSON = fs.readFileSync("./secrets/service_account_key.json", readOpts);
const folderId = fs.readFileSync("./secrets/folder_id.txt", readOpts).trim();
const subfolderId = fs.readFileSync("./secrets/subfolder_id.txt", readOpts).trim();
const testTxtFileId = fs.readFileSync("./secrets/test_txt_fileId.txt", readOpts).trim();

const drive = upload.getDriveClient(serviceAccountKeyJSON);

test('getDriveClient returns drive', () => {
  expect(drive).toBeInstanceOf(drive_v3.Drive);
});

test('getFolderId no subfolder', async () => {
  const newFolderId = await upload.getFolderId(drive, 'a folder id', '');

  expect(newFolderId).toBe('a folder id');
});

test('getFolderId existing subfolder', async () => {
  const newSubfolderId = await upload.getFolderId(drive, folderId, 'subfolder');

  expect(newSubfolderId).toBe(subfolderId);
});

test('getFileId overwrite false', async () => {
  const fileId = await upload.getFileId(drive, false, 'dummy', 'dummy');

  expect(fileId).toBeNull();
});

test('getFileId overwrite true new file', async () => {
  const fileId = await upload.getFileId(drive, true, 'new-filename', folderId);

  expect(fileId).toBeNull();
});

test('getFileId overwrite true existing', async () => {
  const fileId = await upload.getFileId(drive, true, 'test.txt', folderId);

  expect(fileId).toBe(testTxtFileId);
});
