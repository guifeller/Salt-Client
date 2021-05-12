const electron = require('electron');
const url = require('url');
const path = require('path');
const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname + '/Components', 'login.html'),
        protocol: 'file',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        app.quit();
    });

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

//Removes the 'electron' tab from the menu on Mac
if(process.plaform === 'darwin') {
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Chrome Dev Tools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            } 
        ]
    });
}