const gradePoints = { S: 10, A: 9, B: 8, C: 7, D: 6, E: 5, F: 0 };
const form = document.getElementById("courseForm");
const tableBody = document.querySelector("#courseTable tbody");
const sgpaValue = document.getElementById("sgpaValue");

let courses = [];

// Add course
form.addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("courseName").value;
  const credits = parseInt(document.getElementById("courseCredits").value);
  const grade = document.getElementById("courseGrade").value;

  if (!name || !credits || !grade) return;

  const result = grade === "F" ? "Fail" : "Pass";
  const course = { name, credits, grade, result };

  courses.push(course);
  renderTable();
  form.reset();
});

// Render table
function renderTable() {
  tableBody.innerHTML = "";

  courses.forEach((course, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${course.name}</td>
      <td>${course.credits}</td>
      <td>${course.grade}</td>
      <td>${course.result}</td>
      <td><button class="delete-btn" onclick="deleteCourse(${index})">🗑️</button></td>
    `;
    row.classList.add("animate-row");
    tableBody.appendChild(row);
  });

  calculateSGPA();
}

// Delete course
function deleteCourse(index) {
  courses.splice(index, 1);
  renderTable();
}

// Calculate SGPA
function calculateSGPA() {
  let totalCredits = 0, totalPoints = 0;

  courses.forEach(course => {
    totalCredits += course.credits;
    totalPoints += gradePoints[course.grade] * course.credits;
  });

  const sgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  sgpaValue.textContent = sgpa;

  // Glow animation
  const sgpaContainer = document.getElementById("sgpaContainer");
  sgpaContainer.classList.remove("glow");
  void sgpaContainer.offsetWidth;
  sgpaContainer.classList.add("glow");
}

// Clear all courses with confirmation
document.getElementById("clearBtn").addEventListener("click", () => {
  if (courses.length === 0) {
    alert("No courses to clear!");
    return;
  }
  const confirmClear = confirm("Are you sure you want to clear all courses?");
  if (confirmClear) {
    courses = [];
    renderTable();
    calculateSGPA();
  }
});

// Export to CSV
document.getElementById("exportBtn").addEventListener("click", () => {
  if (courses.length === 0) {
    alert("No data to export!");
    return;
  }

  let csvContent = "Course Name,Credits,Grade,Result\n";
  courses.forEach(c => {
    csvContent += `${c.name},${c.credits},${c.grade},${c.result}\n`;
  });
  csvContent += `SGPA,,${sgpaValue.textContent},\n`;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "gpa_report.csv";
  link.click();
});
