
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCounter = document.getElementById("todoCounter");
const todoFilterButtons = document.querySelectorAll(
    "#todoFilters button"
);

let todoTasks = [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem(
        "hassanTodoTasks",
        JSON.stringify(todoTasks)
    );
}

function renderTasks() {
    todoList.innerHTML = "";

    todoTasks.forEach(function(task, index) {
        if (
            currentFilter === "active" &&
            task.completed
        ) {
            return;
        }

        if (
            currentFilter === "completed" &&
            !task.completed
        ) {
            return;
        }

        const listItem = document.createElement("li");
        const taskLabel = document.createElement("span");

        taskLabel.textContent = task.text;

        if (task.completed) {
            taskLabel.style.textDecoration = "line-through";
        }

        listItem.appendChild(taskLabel);

        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed
            ? "Undo"
            : "Complete";

        completeButton.addEventListener("click", function() {
            todoTasks[index].completed =
                !todoTasks[index].completed;

            saveTasks();
            renderTasks();
        });

        listItem.appendChild(completeButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {
            todoTasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        listItem.appendChild(deleteButton);
        todoList.appendChild(listItem);
    });

    const completedCount = todoTasks.filter(function(task) {
        return task.completed;
    }).length;

    const activeCount = todoTasks.length - completedCount;

    todoCounter.textContent =
        "All: " + todoTasks.length +
        " | Completed: " + completedCount +
        " | Active: " + activeCount;

    todoFilterButtons.forEach(function(button) {
        button.style.opacity =
            button.dataset.filter === currentFilter
                ? "1"
                : "0.65";
    });
}

todoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = todoInput.value.trim();

    if (taskText === "") {
        return;
    }

    todoTasks.push({
        text: taskText,
        completed: false
    });

    saveTasks();
    todoInput.value = "";
    renderTasks();
});

todoFilterButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        currentFilter = button.dataset.filter;
        renderTasks();
    });
});

try {
    const savedTasks = JSON.parse(
        localStorage.getItem("hassanTodoTasks") || "[]"
    );

    if (Array.isArray(savedTasks)) {
        todoTasks = savedTasks.map(function(task) {
            if (typeof task === "string") {
                return {
                    text: task,
                    completed: false
                };
            }

            return {
                text: task.text || "",
                completed: Boolean(task.completed)
            };
        });
    }
} catch (error) {
    todoTasks = [];
}

renderTasks();
