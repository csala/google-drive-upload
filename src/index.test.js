const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const process = require('process');

const serviceAccountKeyJSON = fs.readFileSync("./secrets/service_account_key.json");
const folderId = fs.readFileSync("./secrets/folder_id.txt");

test('Upload test.txt', () => {
  process.env['INPUT_SERVICE_ACCOUNT_KEY_JSON'] = serviceAccountKeyJSON;
  process.env['INPUT_FOLDER_ID'] = folderId;
  process.env['INPUT_LOCAL_PATH'] = 'test/test.txt';
  process.env['INPUT_OVERWRITE'] = 'true';
  process.env['INPUT_CONVERT'] = 'false';

  const ip = path.join(__dirname, 'index.js');
  cp.execSync(`node ${ip}`, {env: process.env}).toString();
})

test('Upload test.csv', () => {
  process.env['INPUT_SERVICE_ACCOUNT_KEY_JSON'] = serviceAccountKeyJSON;
  process.env['INPUT_FOLDER_ID'] = folderId;
  process.env['INPUT_LOCAL_PATH'] = 'test/test.csv';
  process.env['INPUT_OVERWRITE'] = 'true';
  process.env['INPUT_CONVERT'] = 'false';

  const ip = path.join(__dirname, 'index.js');
  cp.execSync(`node ${ip}`, {env: process.env}).toString();
})

test('Upload csv', () => {
  process.env['INPUT_SERVICE_ACCOUNT_KEY_JSON'] = serviceAccountKeyJSON;
  process.env['INPUT_FOLDER_ID'] = folderId;
  process.env['INPUT_LOCAL_PATH'] = 'test/test.csv';
  process.env['INPUT_REMOTE_FILENAME'] = 'csv';
  process.env['INPUT_OVERWRITE'] = 'true';
  process.env['INPUT_CONVERT'] = 'true';

  const ip = path.join(__dirname, 'index.js');
  cp.execSync(`node ${ip}`, {env: process.env}).toString();
})

test('Upload test.xlsx', () => {
  process.env['INPUT_SERVICE_ACCOUNT_KEY_JSON'] = serviceAccountKeyJSON;
  process.env['INPUT_FOLDER_ID'] = folderId;
  process.env['INPUT_LOCAL_PATH'] = 'test/test.xlsx';
  process.env['INPUT_REMOTE_FILENAME'] = '';
  process.env['INPUT_SUBFOLDER_NAME'] = 'subfolder';
  process.env['INPUT_OVERWRITE'] = 'true';
  process.env['INPUT_CONVERT'] = 'false';

  const ip = path.join(__dirname, 'index.js');
  cp.execSync(`node ${ip}`, {env: process.env}).toString();
})

test('Upload spreadsheet', () => {
  process.env['INPUT_SERVICE_ACCOUNT_KEY_JSON'] = serviceAccountKeyJSON;
  process.env['INPUT_FOLDER_ID'] = folderId;
  process.env['INPUT_LOCAL_PATH'] = 'test/test.xlsx';
  process.env['INPUT_REMOTE_FILENAME'] = 'spreadsheet';
  process.env['INPUT_SUBFOLDER_NAME'] = 'subfolder';
  process.env['INPUT_OVERWRITE'] = 'true';
  process.env['INPUT_CONVERT'] = 'true';

  const ip = path.join(__dirname, 'index.js');
  cp.execSync(`node ${ip}`, {env: process.env}).toString();
})
