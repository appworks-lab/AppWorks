import * as fse from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { getDataFromSettingJson } from '@iceworks/common-service';
import { getNowDay } from './time';

import orderBy = require('lodash.orderby');

const CONFIGURATION_KEY_TIME_STORAGE_LIMIT = 'timeLimit';
const DEFAULT_TIME_STORAGE_LIMIT = 7;

export function getStoragePath() {
  const homedir = os.homedir();
  const storagePath = path.join(homedir, '.iceworks', 'TimeMaster');
  if (!fse.existsSync(storagePath)) {
    fse.mkdirSync(storagePath);
  }
  return storagePath;
}

export function getStorageDaysPath() {
  const storagePath = getStoragePath();
  const storageDaysPath = path.join(storagePath, 'days');
  if (!fse.existsSync(storageDaysPath)) {
    fse.mkdirSync(storageDaysPath);
  }
  return storageDaysPath;
}

export function getStoragePayloadsPath() {
  const storagePath = getStoragePath();
  const storagePayloadsPath = path.join(storagePath, 'payloads');
  if (!fse.existsSync(storagePayloadsPath)) {
    fse.mkdirSync(storagePayloadsPath);
  }
  return storagePayloadsPath;
}

export function getStorageReportsPath() {
  const storagePath = getStoragePath();
  const storagePayloadsPath = path.join(storagePath, 'reports');
  if (!fse.existsSync(storagePayloadsPath)) {
    fse.mkdirSync(storagePayloadsPath);
  }
  return storagePayloadsPath;
}

export function getStorageDayPath(day?: string) {
  const storageDaysPath = getStorageDaysPath();
  const storageDayPath = path.join(storageDaysPath, day || getNowDay());
  if (!fse.existsSync(storageDayPath)) {
    fse.mkdirSync(storageDayPath);
  }
  return storageDayPath;
}

export async function getStorageDaysDirs() {
  const storageDaysPath = getStorageDaysPath();
  const fileNames = await fse.readdir(storageDaysPath);
  const dayDirPaths = orderBy((await Promise.all(fileNames.map(async (fileName) => {
    const filePath = path.join(storageDaysPath, fileName);
    const fileStat = await fse.stat(filePath);

    // TODO more rigorous
    return fileStat.isDirectory() ? fileName : undefined;
  }))).filter((isDirectory) => isDirectory));
  return dayDirPaths;
}

export async function checkStorageDaysIsLimited() {
  const timeStorageLimit = getDataFromSettingJson(CONFIGURATION_KEY_TIME_STORAGE_LIMIT) || DEFAULT_TIME_STORAGE_LIMIT;
  const storageDaysDirs = await getStorageDaysDirs();
  const excess = storageDaysDirs.length - timeStorageLimit;

  // over the limit, delete the earlier storage
  if (excess) {
    const storageDaysPath = getStorageDaysPath();
    await Promise.all(storageDaysDirs.splice(0, excess).map(async (dayDir) => {
      await fse.remove(path.join(storageDaysPath, dayDir));
    }));
  }
}
