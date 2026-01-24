//===========================
//      DOM ELEMENTS
//===========================
const sortToggleBtn = document.getElementById("sortToggle");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const overdueCount = document.getElementById("overdueCount");

const titleInput = document.getElementById("titleInput");
const dueDateInput = document.getElementById("dueDateInput");
const subjectInput = document.getElementById("subjectInput");
const priorityInput = document.getElementById("priorityInput");
const addBtn = document.getElementById("addBtn");
const assignmentList = document.getElementById("assignmentList");

const openAddBtn = document.getElementById("openAdd");
const addSection = document.getElementById("addSection");
const filterButtons = document.querySelectorAll(".filters button");

//===========================
//        CONSTANTS
//===========================
const priorityRank = {
  high: 1,
  medium: 2,
  low: 3
};

const SUBJECT_COLORS = {
  General: "#6b7280",  // gray
  Math: "#2563eb",     // blue
  Physics: "#16a34a",  // green
  CS: "#7c3aed"        // purple
};

const SORT_MODES = ["due", "created", "priority"];


//===========================
//      CURRENT STATES
//===========================
let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
let currentFilter = "all";
let sortModeIndex = 0;


//===========================
//          HELPERS
//===========================
function createAssignment(title, subject, dueDate,priority) {
  return {
    id: Date.now(),        // unique ID
    title,
    subject,
    dueDate,
    completed: false,
    createdAt: Date.now(),
    priority
  };
}

//===================================
//              RENDER
//===================================
function renderAssignments() {
  let list = [...assignments];
  const today = new Date().setHours(0, 0, 0, 0);
  
  // Filter
  if (currentFilter === "pending") {
    list = list.filter(a => !a.completed);
  } else if (currentFilter === "completed") {
    list = list.filter(a => a.completed);
  }

  // Sort
  const currentSort = getCurrentSortMode();
  if (currentSort === "due") {
    list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }
  else if (currentSort === "created"){
    list.sort((a,b) => a.createdAt - b.createdAt);
  }
  else if (currentSort === "priority") {
    list.sort((a, b) => {
      const priorityDiff = priorityRank[a.priority] - priorityRank[b.priority];

      if (priorityDiff !== 0) {
        return priorityDiff; 
      }

      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  assignmentList.innerHTML = "";

  list.forEach((item) => {
    const li = document.createElement("li");
    const subject = item.subject || "General";
    const color = SUBJECT_COLORS[subject] || SUBJECT_COLORS.General;

    li.style.borderLeft = `6px solid ${color}`;
    li.style.borderRadius = "10px";
    li.style.padding = "0.8rem";
    li.style.marginBottom = "0.6rem";
    li.style.background = "#fff";

    const isOverdue =
      !item.completed && new Date(item.dueDate) < today;

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
          <span class="priority ${item.priority}">
              ${item.priority.toUpperCase()}
          </span>
        </label>
        <button class="deleteBtn"> ✕ </button>
      </div>
      <small class="subject">
        ${item.subject || "General"}
      </small>

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
    const deleteBtn = li.querySelector(".deleteBtn ");
    deleteBtn.addEventListener("click", () => {
      assignments = assignments.filter(a => a.id !== item.id);
      localStorage.setItem("assignments", JSON.stringify(assignments));
      renderAssignments();
    });

    assignmentList.appendChild(li);
  });
  
  updateStats();
}

// ======================
// SORT TOGGLE
// ======================
function getCurrentSortMode() {
  return SORT_MODES[sortModeIndex];
}

function updateSortIcon() {
  if (!sortToggleBtn) return;

  const icons = {
    due: "⏰",
    created: "🕒",
    priority: "⚡"
  };

  sortToggleBtn.textContent = icons[getCurrentSortMode()];
}

if (sortToggleBtn) {
  sortToggleBtn.addEventListener("click", () => {
    sortModeIndex = (sortModeIndex + 1) % SORT_MODES.length;
    updateSortIcon();
    renderAssignments();
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

//=============================
//      EVENT LISTENERS
//=============================

// Add assignment
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;
  const subject = subjectInput.value.trim();
  const priority = priorityInput.value;

  if (!title || !dueDate) {
    alert("Please enter title and due date");
    return;
  }

  assignments.push(createAssignment(title, subject, dueDate, priority));
  localStorage.setItem("assignments", JSON.stringify(assignments));
  addSection.classList.add("hidden");
  titleInput.value = "";
  dueDateInput.value = "";

  renderAssignments();
});

// Cancel add
document.getElementById("cancelAdd").addEventListener("click", () => {
  addSection.classList.add("hidden");
});

// Open add section
openAddBtn.addEventListener("click", () => {
  addSection.classList.toggle("hidden");

  if (!addSection.classList.contains("hidden")) {
    titleInput.focus();
  }
});

// Filter buttons
filterButtons.forEach(filterBtn => {
  filterBtn.addEventListener("click", () => {
    currentFilter = filterBtn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    filterBtn.classList.add("active");

    renderAssignments();
  });
});

// Sort toggle

//=============================
//       INITIALIZATION
//=============================
updateSortIcon();
renderAssignments();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}