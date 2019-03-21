const { app, BrowserWindow } = require('electron')
const electronLocalshortcut = require('electron-localshortcut')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
app.setName('EveShop')

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    }
  })
  // and load the index.html of the app.
 // const index = path.resolve('./Electron/main.html')
  //win.loadFile(index)
  win.loadURL(url.format({
    pathname: path.join(__dirname, './main.html'),
    protocol: 'file:',
    slashes: true
    }));
  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)
if (process.platform == 'darwin') {
    electronLocalshortcut.register('Command+Q', () => {
        app.quit()
      })
  }
  
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
 if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
app.on('before-quit', () => {
    console.log('emitted before quitting!')
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here