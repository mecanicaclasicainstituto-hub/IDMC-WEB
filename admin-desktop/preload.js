const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('adminApi', {
  getState: () => ipcRenderer.invoke('admin:get-state'),
  saveState: (state) => ipcRenderer.invoke('admin:save-state', state),
  resetState: () => ipcRenderer.invoke('admin:reset-state'),
  importFile: () => ipcRenderer.invoke('admin:import-file'),
  exportFile: () => ipcRenderer.invoke('admin:export-file')
});
