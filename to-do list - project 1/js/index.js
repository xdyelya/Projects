const addTaskButton = document.getElementById('add-task');
const newTaskInput = document.getElementById('new-task');
const toDoColumn = document.getElementById('to-do');
const inProgressColumn = document.getElementById('in-progress');
const doneColumn = document.getElementById('done');

function createTaskElement(taskText, status) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task';
    taskElement.innerHTML = `
        <span>${taskText}</span>
        <button class="btn btn-danger btn-sm float-right delete-task">X</button>
        ${status === 'to-do' ? '<button class="btn btn-info btn-sm float-right move-to-in-progress">In Progress</button>' : ''}
        ${status === 'in-progress' ? '<button class="btn btn-success btn-sm float-right move-to-done">Done</button>' : ''}
    `;
    return taskElement;
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text, task.status);
        if (task.status === 'to-do') {
            toDoColumn.appendChild(taskElement);
        } else if (task.status === 'in-progress') {
            inProgressColumn.appendChild(taskElement);
        } else if (task.status === 'done') {
            doneColumn.appendChild(taskElement);
        }
    });
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#to-do .task').forEach(task => {
        tasks.push({ text: task.querySelector('span').innerText, status: 'to-do' });
    });
    document.querySelectorAll('#in-progress .task').forEach(task => {
        tasks.push({ text: task.querySelector('span').innerText, status: 'in-progress' });
    });
    document.querySelectorAll('#done .task').forEach(task => {
        tasks.push({ text: task.querySelector('span').innerText, status: 'done' });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskButton.addEventListener('click', () => {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        const taskElement = createTaskElement(taskText, 'to-do');
        toDoColumn.appendChild(taskElement);
        newTaskInput.value = '';
        saveTasks();
    }
});

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-task')) {
        event.target.parentElement.remove();
        saveTasks();
    } else if (event.target.classList.contains('move-to-in-progress')) {
        const taskElement = event.target.parentElement;
        taskElement.removeChild(event.target);

        const moveToDoneButton = document.createElement('button');
        moveToDoneButton.className = 'btn btn-success btn-sm float-right move-to-done';
        moveToDoneButton.textContent = 'Done';

        taskElement.appendChild(moveToDoneButton);
        inProgressColumn.appendChild(taskElement);
        saveTasks();
    } else if (event.target.classList.contains('move-to-done')) {
        const taskElement = event.target.parentElement;
        taskElement.removeChild(event.target);

        doneColumn.appendChild(taskElement);
        saveTasks();
    }
});

loadTasks();
