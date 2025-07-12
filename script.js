const API_URL = "https://todo-backend.onrender.com/api/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value;
  if (!text) return;

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: text })
  });

  const task = await res.json();
  addTaskToDOM(task);
  taskInput.value = "";
});

async function loadTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.textContent = task.description;
  li.className = task.completed ? "completed" : "";

  li.addEventListener("click", async () => {
    await fetch(`${API_URL}/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });
    li.classList.toggle("completed");
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.style.marginLeft = "10px";
  delBtn.onclick = async () => {
    await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
    li.remove();
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

loadTasks();
