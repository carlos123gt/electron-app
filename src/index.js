const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const main = require('electron-reload');

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow;
let newTaskWindow;
let loginWindow;
let sessionStatus = false;

let mainMenu;

app.on('ready', () => {
    mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    if (sessionStatus === true) {
        mainWindowOn();
    } else {
        loginSessionWindow();
    }
});

const mainWindowOn = () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/index.html'),
        protocol: 'file',
        slashes: true
    }))

    mainWindow.on('closed', () => {
        app.quit();
    });
}

const validateLogin = () => {
    if (sessionStatus) {
        mainWindowOn();
        loginWindow.close();
    }
}

const loginSessionWindow = () => {
    loginWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 450,
        height: 500
    });

    loginWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/login.html'),
        protocol: 'file',
        slashes: true
    }));
}

const createNewTaskWindow = () => {
    newTaskWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        transparent: true,
        frame: false,
        width: 450,
        height: 400
    });

    newTaskWindow.setMenu(null);

    newTaskWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'views/new-task.html'),
        protocol: 'file',
        slashes: true
    }));

    newTaskWindow.on('closed', () => {
        newTaskWindow = null;
    })
}

ipcMain.on('task:new', (e, newTask) => {
    mainWindow.webContents.send('task:new', newTask);
    newTaskWindow.close();
});

ipcMain.on('task:close', (e) => {
    newTaskWindow.close();
});

ipcMain.on('session:enter', (e) => {
    sessionStatus = true;
    console.log(sessionStatus)
    validateLogin();
});

const templateMenu = [{
        label: 'Archivo',
        submenu: [{
                label: 'Nueva Tarea',
                accelerator: process.platform == 'darwin' ? 'command+N' : 'Ctrl+N',
                click() {
                    createNewTaskWindow();
                }
            },
            {
                label: 'Eliminar Todo',
                click() {
                    mainWindow.webContents.send('task:deleteAll');
                }
            },
            {
                label: 'Salir',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }

];

if (process.platform === 'darwin') {
    templateMenu.unshift({
        label: app.getName()
    });
}

if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'Herramientas de desarrollo',
        submenu: [{
                label: 'Mostrar/Ocultar Herramientas de desarrollo',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}