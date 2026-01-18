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
    li.innerHTML = `
      <strong>${item.title}</strong><br/>
      <small>Due: ${item.dueDate}</small>
    `;
    assignmentList.appendChild(li);
  });
}

// Add assignment
addBtn.addEventListener("click", () => {
  const title = titleInput.value.trim();
  const dueDate = dueDateInput.value;

  if (!title || !dueDate) {
    alert("Please enter title and due date");
    return;
  }

  assignments.push({ title, dueDate });
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