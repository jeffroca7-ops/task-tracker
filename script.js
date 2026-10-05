const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const addTaskButton = document.querySelector("#addTaskButton");
const taskCount = document.querySelector("#taskCount");
const allFilter = document.querySelector("#allFilter");
const activeFilter = document.querySelector("#activeFilter");
const completedFilter = document.querySelector("#completedFilter");
const savedTasks = localStorage.getItem("tasks");
let tasks = [];
let currentFilter = "all";

try {
    if (saveTasks) {
        tasks = JSON.parse(savedTasks);
    }

} catch (error) {
    tasks = [];

}

if (!Array.isArray(tasks)) {
    tasks = [];
}


function createTaskElement(task) {
    const listItem = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    listItem.appendChild(taskText);

    if (task.completed === true) {
            taskText.classList.add("completed");
        }

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    listItem.appendChild(deleteButton);

    listItem.addEventListener("click", function() {
        taskText.classList.toggle("completed");
        task.completed = taskText.classList.contains("completed");

        saveTasks();
        updateTaskCount();0
        renderTasks();

        
    });


         deleteButton.addEventListener("click", function(event) {
            event.stopPropagation();
            listItem.remove();
            const taskIndex = tasks.indexOf(task);
            tasks.splice(taskIndex, 1);

            saveTasks();
            updateTaskCount();
        });

        taskList.appendChild(listItem);
}


tasks.forEach(function(task) {
    createTaskElement(task);
});
            updateTaskCount();
            updateActiveFilter();


addTaskButton.addEventListener('click', function() {
    const taskText = taskInput.value.trim();

    if (taskText !== '') {

        const newTask = {
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();
        updateTaskCount();

         taskInput.value = "";
    }
});

    taskInput.addEventListener("keydown", function(event) {

        if (event.key === "Enter") {
            addTaskButton.click();
        }
        
    });

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskCount()  {

     const remainingTasks = tasks.filter(function (task) {
        return task.completed === false;
     }).length;

            if (remainingTasks === 1) {
                taskCount.textContent = remainingTasks + " task remaining";
            } else {
                taskCount.textContent = remainingTasks + " tasks remaining";
            }  
}

function renderTasks(){
    taskList.innerHTML = "";

    let tasksToRender = tasks;

    if (currentFilter === "active") {
        tasksToRender = tasks.filter(function(task){
            return task.completed === false; 
        });
    }

        else if (currentFilter === "completed") {
            tasksToRender = tasks.filter(function (task) {
                return task.completed === true;
            });
        }

        if (tasksToRender.length === 0) {
            const emptyMessage = document.createElement("li");
            emptyMessage.textContent = "No tasks here.";
            emptyMessage.classList.add("empty-message");
            taskList.appendChild(emptyMessage);
        }

        tasksToRender.forEach(function (task) {
        createTaskElement(task);
    });

    }


function updateActiveFilter() {
    allFilter.classList.remove("active-filter");
    activeFilter.classList.remove("active-filter");
    completedFilter.classList.remove("active-filter");

    if (currentFilter === "all") {
        allFilter.classList.add("active-filter");
    } 
        else if (currentFilter === "active") {
            activeFilter.classList.add("active-filter");
        }
            else if (currentFilter ==="completed") {
                completedFilter.classList.add("active-filter");
        }
}


allFilter.addEventListener("click", function() {
    currentFilter = "all";
    updateActiveFilter();
    renderTasks();

});

activeFilter.addEventListener("click", function() {
    currentFilter = "active";
    updateActiveFilter();
    renderTasks();
    
});

completedFilter.addEventListener("click", function() {
    currentFilter = "completed";
    updateActiveFilter();
    renderTasks();

});