const electron = require('electron');
const path = require('path');
const {app, BrowserWindow, shell, Menu, Tray, ipcMain } = electron;
const gotTheLock = app.requestSingleInstanceLock();
const settings = require('electron-settings');
const { autoUpdater } = require('electron-updater')

let messenger;
let tray = null

// méthode single instance
if (!gotTheLock){
    app.quit();   
} else {
    app.on('second-instance', () => {
        if (messenger) {
            if (messenger.isMinimized()) {
                messenger.show()
            };
            messenger.focus();
        };
    })
}

app.on('ready', function(){
    app.requestSingleInstanceLock();
    autoUpdater.checkForUpdatesAndNotify();
// Fenêtre de l'application
    // Fenêtre messenger
    messenger = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            webviewTag: true,
        },
        minHeight: 800,
        minWidth: 550,
        height: 900,
        width: 950,
        icon: path.join(__dirname, "/static/img/mess.ico"),
        frame: false,
        show: false,
        title: "Not Your Messenger",
    });

    // icône dans le Tray
    tray = new Tray(path.join(__dirname, "/static/img/mess.ico"))
    const contextMenu = new Menu.buildFromTemplate([
        { label: "Quitter NYM", click() { 
            position = messenger.getPosition();
            messengerSize = messenger.getSize();
            settings.set('position', {
                x: position[0],
                y: position[1]
            });
            settings.set('windowsSize', {
                width: messengerSize[0],
                height: messengerSize[1]
            })
            console.log(messengerSize)
            messenger.destroy() }}
    ]);
    tray.setToolTip('Not Your Messenger');
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        messenger.show()
    })


    // démarrage de l'application
    messenger.setMenu(null);
    messenger.webContents.on('did-finish-load', () => {
        positionx = settings.get('position.x');
        positiony = settings.get('position.y');
        winWidth = settings.get('windowsSize.width');
        winHeight = settings.get('windowsSize.height');
        if (settings.has('position.x')){
            messenger.show();
            messenger.restore();
            messenger.setPosition(positionx, positiony);
            messenger.setSize(winWidth, winHeight);
        } else {
            messenger.show();
            messenger.restore();
        };
    });

    // attrappe l'ouverture de lien et l'ouvre dans le navigateur par défaut
    app.on('web-contents-created', (e, contents) => {
        if (contents.getType() == 'webview') {
            contents.on('new-window', (e, url) => {
                e.preventDefault();
                shell.openExternal(url);
            });
        };
    });

    ipcMain.on('restart_app', () => {
        autoUpdater.quitAndInstall();
    });

// fonctionnalités
    // désactive le menu et affiche l'url messenger
    messenger.loadFile("./template/main.html");


// auto update fonctions
    autoUpdater.on('update-available', () => {
        messenger.webContents.send('Mise à jour disponible');
    });

    autoUpdater.on('update-downloaded', () => {
        messenger.webContents.send('Mise à jour télécharger')
    })
})
