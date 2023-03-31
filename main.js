// main.js

// Modules to control application life and create native browser window
const {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  shell,
} = require("electron");
const path = require("path");

const createWindow = () => {
  let devtoolsOpen = false;
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    title: "Gather | A better way to meet.",
    logo: `${__dirname}/gather-logo.svg`,
    icon: `${__dirname}/gather-logo.png`,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    show: false,
    backgroundColor: "rgb(40, 45, 78)",
  });

  // and load the index.html of the app.
  mainWindow.loadURL("https://app.gather.town/signin", {
    httpReferrer: {
      url: "https://app.gather.town/",
      policy: "same-origin",
    },
    userAgent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.5195.102 Safari/537.36",
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.removeMenu();

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();

  // Deal with external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  ipcMain.handle("TOGGLE_DEV_TOOLS", async (event, opts) => {
    if (!devtoolsOpen) {
      mainWindow.webContents.openDevTools();
    } else {
      mainWindow.webContents.closeDevTools();
    }
  });

  mainWindow.webContents.on("devtools-opened", () => {
    devtoolsOpen = true;
    // setImmediate(() => {
    //     // do whatever you want to do after dev tool completely opened here

    // });
  });

  mainWindow.webContents.on("devtools-closed", () => {
    devtoolsOpen = false;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", async (event, opts) => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ["window", "screen"],
    });

    return sources.map((source) => ({
      ...source,
      thumbnail_data: source.thumbnail.toDataURL(),
    }));
  } catch (e) {
    console.error(e);
  }
});
