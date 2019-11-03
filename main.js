const setupEvents = require('./installers/setupEvents');
const electron = require('electron');
const path = require('path');
const {app, BrowserWindow, shell} = electron;
const gotTheLock = app.requestSingleInstanceLock();
const {dialog} = require('electron');
const fs = require('fs');
const settings = require('electron-settings');

let messenger;

// squirrel installation méthode
if (setupEvents.handleSquirrelEvent()) {
    return;
};

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


    // démarrage de l'application
    messenger.setMenu(null);
    messenger.webContents.on('did-finish-load', () => {
        positionx = settings.get('position.x');
        positiony = settings.get('position.y');
        winWidth = settings.get('windowsSize.width');
        winHeight = settings.get('windowsSize.height');
        loadingWindow.destroy();
        messenger.show();
        messenger.setPosition(positionx, positiony);
        messenger.setSize(winWidth, winHeight);
    });

    // attrappe l'ouverture de lien et l'ouvre dans le navigateur par défaut
    app.on('web-contents-created', (e, contents) => {
        if (contents.getType() == 'webview') {
            contents.on('new-window', (e, url) => {
                if (url=='http://messenger.com/') {
                    loadingWindow.open();
                } else {
                    e.preventDefault();
                    shell.openExternal(url);
                };
            });
        };
    });

// fonctionnalités
    // désactive le menu et affiche l'url messenger
    messenger.loadFile("./template/main.html");
    messenger.webContents.on('did-finish-load', function() {
        messenger.webContents.insertCSS(fs.readFileSync(path.join(__dirname, '/static/loading.css'), "utf-8"))  
    });


    // attrape l'event close et cache la fenêtre pour fermer l'application
    messenger.on('close', function (event){

        // enregistre la dernière position et la dernière taille de la fenêtre
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

        event.preventDefault();

        let options = {
            type: 'question',
            buttons: ['Oui', 'Non'],
            cancelId: 1,
            message: "Quitter l'application?",
            title: "Not Your Messenger",
            icon: path.join(__dirname, "/static/img/mess.ico")
        };
        
        dialog.showMessageBox(messenger, options, response => {
            if (response === 0) {
                messenger.destroy();
            };
        });
    });

    // fonctionnalité taskbar
    // flash...

})
