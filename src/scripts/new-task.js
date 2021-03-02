const { ipcRenderer } = require('electron');

const form = document.querySelector('#form');
const close = document.querySelector('#close-button');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const titleTask = document.querySelector('#title').value;
    const descTask = document.querySelector('#description').value;
    const priorityTask = document.querySelector('#priority').value;

    const newTask = {
        title: titleTask,
        description: descTask,
        priority: priorityTask
    }

    ipcRenderer.send('task:new', newTask);

});

close.addEventListener('click', (e) => {
    ipcRenderer.send('task:close')
});