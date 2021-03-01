const { ipcRenderer } = require('electron');
const { v4: uuidv4 } = require('uuid')

const tasks = document.querySelector('#pending');

const ifNotTask = `<p id="sinTarea">No hay tareas registradas</p>`;

const validateNumbersTasks = () => {
    if(ifNotTask){
        if(tasks.childElementCount == 0){
            tasks.innerHTML = ifNotTask;
        }else{
            const textTask = document.querySelector('#sinTarea');
            if(textTask){
                textTask.remove();
            }
        }
    }
}

validateNumbersTasks();

ipcRenderer.on('task:new', (e, newTask) => {
    let classPriority;

    if(newTask.priority == "bajo"){
        newTask.priority = "Baja";
        classPriority = "lowSpan";
    }else if(newTask.priority == "medio"){
        newTask.priority = "Media";
        classPriority = "middleSpan";
    }else{
        newTask.priority = "Alta";
        classPriority = "hightSpan"
    }

    const newTaskTemplate = `
        <div class="card" draggable="true" ondragstart="drag(event)" id="${uuidv4()}">
            <div class="card-head">
                <p>${newTask.title}</p>
            </div>
            <div class="card-body">
                <p>${newTask.description}</p>
                <div>
                    <span>Prioridad: </span>
                    <span class="${classPriority} spanPriority">${newTask.priority}</span>
                </div>
            </div>
            <div class="card-foot">
                <button class="btn-delete">ELIMINAR</button>
            </div>
        </div>
    `;

    tasks.innerHTML += newTaskTemplate;
    const btnDeletes = document.querySelectorAll('.btn-delete');

    btnDeletes.forEach(btn => {
        btn.addEventListener('click', (e) => {
           e.target.parentElement.parentElement.remove();
           validateNumbersTasks();
        });
    });
    validateNumbersTasks();
});

ipcRenderer.on('task:deleteAll', () => {
    const cardsTask = document.querySelectorAll('.card');
    cardsTask.forEach(card => {
        card.remove();
    });
    validateNumbersTasks();
});

const allowDrop = (e) => {
    e.preventDefault();
}

const drag = (e) => {
    e.dataTransfer.setData('text', e.target.id);
}

const drop = (e) => {
    e.preventDefault();
    let data = e.dataTransfer.getData('text');
    e.target.appendChild(document.getElementById(data))
}