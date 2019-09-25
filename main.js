const setupEvents = require('./installers/setupEvents');
const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, shell} = electron;
const gotTheLock = app.requestSingleInstanceLock();
const {dialog} = require('electron');
const fs = require('fs');

let messenger;
let loadingWindow;

// squirrel installation méthode
if (setupEvents.handleSquirrelEvent()) {
    return;
};


// méthode single instance
if (!gotTheLock){
    app.quit();   
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (messenger) {
            if (messenger.isMinimized()) messenger.show();
            messenger.focus();
        };
    })
}


app.on('ready', function(){
    app.requestSingleInstanceLock();

// Fenêtre de l'application
    // Fenêtre de chargement
    loadingWindow = new BrowserWindow({
        frame: false,
        height: 300,
        width: 450,
        transparent: true
    });
    
    loadingWindow.loadURL(url.format({
        pathname: path.join(__dirname, '/template/loading.html'),
        protocol: 'file',
        slashes: true
    }));

    loadingWindow.setMenu(null);

    // Fenêtre messenger
    messenger = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, '/renderer.js')
        },
        minHeight: 400,
        minWidth: 600,
        height: 900,
        width: 950,
        icon: path.join(__dirname, "/static/img/mess.ico"),
        frame: true,
        show: false
    });

    // démarrage de l'application
    messenger.setMenu(null);
    messenger.webContents.on('did-finish-load', () => {
        loadingWindow.destroy();
        messenger.show();
    });

    
// fonctionnalités
    // désactive le menu et affiche l'url messenger
    messenger.loadURL('http://www.messenger.com/login');
    messenger.webContents.on('did-finish-load', function() {
        messenger.webContents.insertCSS(fs.readFileSync(path.join(__dirname, '/static/loading.css'), "utf-8"))  
    });

    // ouvrir les url externe dans le navigateur de l'os
    messenger.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });

    // attrape l'event close et cache la fenêtre pour fermer l'application
    messenger.on('close', function (event){
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
