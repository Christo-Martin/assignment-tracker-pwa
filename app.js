const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const overdueCount = document.getElementById("overdueCount");

const titleInput = document.getElementById("titleInput");
const dueDateInput = document.getElementById("dueDateInput");
const addBtn = document.getElementById("addBtn");
const assignmentList = document.getElementById("assignmentList");

// Load saved assignments
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];

// Render assignments
function renderAssignments() {
  assignmentList.innerHTML = "";

  assignments.forEach((item, index) => {
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
      item.completed = checkbox.checked;
      localStorage.setItem("assignments", JSON.stringify(assignments));
      renderAssignments();
    });

    // Delete assignment
    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      assignments.splice(index, 1);
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

  if (!title || !dueDate) {
    alert("Please enter title and due date");
    return;
  }

  assignments.push({ title, dueDate, completed: false });
  localStorage.setItem("assignments", JSON.stringify(assignments));

  titleInput.value = "";
  dueDateInput.value = "";

  renderAssignments();
});

// Initial render
renderAssignments();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}