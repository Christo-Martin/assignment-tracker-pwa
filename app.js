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
      <label>
        <input type="checkbox" ${item.completed ? "checked" : ""} />
        <strong style="text-decoration:${item.completed ? "line-through" : "none"}">
          ${item.title}
        </strong>
      </label>
      <br/>
      <small>Due: ${item.dueDate}</small>
    `;

    const checkbox = li.querySelector("input");
    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;
      localStorage.setItem("assignments", JSON.stringify(assignments));
      renderAssignments();
    });

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