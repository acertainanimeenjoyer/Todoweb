const API_URL = "https://todoapp-ugmd.onrender.com/api/tasks";

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) {
    alert("⚠️ Task cannot be empty!");
    return;
  }

  console.log("📝 Submitting:", { description: text });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: text })
    });

    if (!res.ok) {
      const errMsg = await res.text();
      throw new Error(`Server returned ${res.status}: ${errMsg}`);
    }

    const task = await res.json();
    addTaskToDOM(task);
    taskInput.value = "";
  } catch (error) {
    console.error("❌ Failed to add task:", error);
    alert("Failed to add task. Please check the console or try again later.");
  }
});

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const tasks = await res.json();
    tasks.forEach(addTaskToDOM);
  } catch (error) {
    console.error("❌ Failed to load tasks:", error);
    taskList.innerHTML = "<li>⚠️ Failed to load tasks.</li>";
  }
}

function addTaskToDOM(task) {
  const li = document.createElement("li");
  li.className = task.completed ? "completed" : "";

  const span = document.createElement("span");
  span.textContent = task.description;
  li.appendChild(span);

  li.addEventListener("click", async () => {
    try {
      await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed })
      });
      li.classList.toggle("completed");
    } catch (error) {
      console.error("❌ Failed to update task:", error);
    }
  });

  const delBtn = document.createElement("button");
  delBtn.textContent = "❌";
  delBtn.style.marginLeft = "10px";
  delBtn.onclick = async (e) => {
    e.stopPropagation(); // Prevent toggling completion
    try {
      await fetch(`${API_URL}/${task._id}`, { method: "DELETE" });
      li.remove();
    } catch (error) {
      console.error("❌ Failed to delete task:", error);
    }
  };

  li.appendChild(delBtn);
  taskList.appendChild(li);
}

loadTasks();
