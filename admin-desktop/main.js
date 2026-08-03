const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

const DEFAULT_DB = {
  users: [],
  posts: [],
  comments: []
};

function getDbPath() {
  return path.join(app.getPath('userData'), 'admin-db.json');
}

function ensureDbFile() {
  const dbPath = getDbPath();
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_DB, null, 2), 'utf8');
  }
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(getDbPath(), 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      posts: Array.isArray(parsed.posts) ? parsed.posts : [],
      comments: Array.isArray(parsed.comments) ? parsed.comments : []
    };
  } catch (err) {
    return { ...DEFAULT_DB };
  }
}

function saveDb(data) {
  const normalized = {
    users: Array.isArray(data.users) ? data.users : [],
    posts: Array.isArray(data.posts) ? data.posts : [],
    comments: Array.isArray(data.comments) ? data.comments : []
  };
  fs.writeFileSync(getDbPath(), JSON.stringify(normalized, null, 2), 'utf8');
  return normalized;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 980,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, 'src', 'index.html'));
}

ipcMain.handle('admin:get-state', async () => {
  return readDb();
});

ipcMain.handle('admin:save-state', async (_evt, payload) => {
  return saveDb(payload || {});
});

ipcMain.handle('admin:reset-state', async () => {
  return saveDb({ ...DEFAULT_DB });
});

ipcMain.handle('admin:import-file', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Selecciona el archivo exportado del sitio web',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (result.canceled || !result.filePaths.length) return null;
  try {
    const raw = fs.readFileSync(result.filePaths[0], 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
});

ipcMain.handle('admin:export-file', async () => {
  const data = readDb();
  const suggestedPath = path.join(__dirname, '..', 'idmc-sync-web.json');
  const result = await dialog.showSaveDialog({
    title: 'Guardar datos para la web',
    defaultPath: suggestedPath,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (result.canceled || !result.filePath) return { ok: false, filePath: '' };
  try {
    fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf8');
    return { ok: true, filePath: result.filePath };
  } catch (err) {
    return { ok: false, filePath: result.filePath || '' };
  }
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
