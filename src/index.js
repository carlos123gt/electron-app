const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
const main = require('electron-reload');

if(process.env.NODE_ENV !== 'production'){
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

let mainWindow;
let newTaskWindow;

app.on('ready', () => {
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

    const mainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(mainMenu)

    mainWindow.on('closed', () => {
        app.quit();
    });
});

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

const templateMenu = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Nueva Tarea',
                accelerator: process.platform == 'darwin' ? 'command+N' : 'Ctrl+N',
                click(){
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

if(process.platform === 'darwin'){
    templateMenu.unshift({
        label: app.getName()
    });
}

if(process.env.NODE_ENV !== 'production'){
    templateMenu.push({
        label: 'Herramientas de desarrollo',
        submenu: [
            {
                label: 'Mostrar/Ocultar Herramientas de desarrollo',
                accelerator: 'Ctrl+D',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}