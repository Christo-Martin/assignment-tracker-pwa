const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const overdueCount = document.getElementById("overdueCount");

const titleInput = document.getElementById("titleInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const addBtn = document.getElementById("addBtn");
const assignmentList = document.getElementById("assignmentList");

// Load saved assignments
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let currentFilter = "all";
let currentSort = "due";
const sortSelect = document.getElementById("sortSelect");
const filterButtons = document.querySelectorAll(".filters button");

function createAssignment(title, dueDate,priority) {
  return {
    id: Date.now(),        // unique ID
    title,
    dueDate,
    completed: false,
    createdAt: Date.now(),
    priority
  };
}

// Render assignments
function renderAssignments() {
  let list = [...assignments];

  // Filter
  if (currentFilter === "pending") {
    list = list.filter(a => !a.completed);
  } else if (currentFilter === "completed") {
    list = list.filter(a => a.completed);
  }

  // Sort
  if (currentSort === "due") {
    list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  assignmentList.innerHTML = "";

  list.forEach((item, index) => {
    const li = document.createElement("li");

    const isOverdue =
      !item.completed && new Date(item.dueDate) < new Date().setHours(0, 0, 0, 0);

    li.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <label>
          <input type="checkbox" ${item.completed ? "checked" : ""} />
          <strong style="
            text-decoration:${item.completed ? "line-through" : "none"};
            color:${isOverdue ? "#dc2626" : "#000"};
          ">
            ${item.title}
            <span class="priority ${item.priority}">
              ${item.priority.toUpperCase()}
            </span>
          </strong>
        </label>
        <button class="delete-btn">✕</button>
      </div>
      <small style="color:${isOverdue ? "#dc2626" : "#555"}">
        Due: ${item.dueDate}${isOverdue ? " (Overdue)" : ""}
      </small>
    `;

    // Complete toggle
    const checkbox = li.querySelector("input");
    checkbox.addEventListener("change", () => {
      assignments = assignments.map(a =>
        a.id === item.id ? { ...a, completed: checkbox.checked } : a
      );
      localStorage.setItem("assignments", JSON.stringify(assignments));
      renderAssignments();
    });

    // Delete assignment
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      assignments = assignments.filter(a => a.id !== item.id);
      localStorage.setItem("assignments", JSON.stringify(assignments));
      renderAssignments();
    });

    assignmentList.appendChild(li);
    updateStats();
  });
}
function updateStats() {
  const total = assignments.length;
  const completed = assignments.filter(a => a.completed).length;
  const pending = total - completed;

  const today = new Date().setHours(0, 0, 0, 0);
  const overdue = assignments.filter(
    a => !a.completed && new Date(a.dueDate) < today
  ).length;

  totalCount.textContent = total;
  pendingCount.textContent = pending;
  completedCount.textContent = completed;
  overdueCount.textContent = overdue;
}

// Add assignment
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;
  const priority = priorityInput.value;


  if (!title || !dueDate) {
    alert("Please enter title and due date");
    return;
  }

  assignments.push(createAssignment(title, dueDate,priority));
  localStorage.setItem("assignments", JSON.stringify(assignments));

  titleInput.value = "";
  dueDateInput.value = "";

  renderAssignments();
});

sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  renderAssignments();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderAssignments();
  });
});


// Initial render
renderAssignments();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}