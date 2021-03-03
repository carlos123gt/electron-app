const { ipcRenderer } = require('electron');

let loginButton = document.querySelector('button');
let sessionAproved = false;

loginButton.addEventListener('click', (e) => {
    sessionAproved = true;
    console.log(sessionAproved)
    ipcRenderer.send('session:enter')
});