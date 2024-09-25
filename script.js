// Retrieve form and table elements from the DOM
const form = document.getElementById('studentRegistrationForm');
const studentTable = document.getElementById('studentTable').getElementsByTagName('tbody')[0];

// Event listener for form submission
form.addEventListener('submit', handleFormSubmit);

// Load existing student records from local storage on page load
loadFromLocalStorage();

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Retrieve form input values
    const studentName = document.getElementById('studentName').value.trim();
    const studentID = document.getElementById('studentID').value.trim();
    const className = document.getElementById('class').value.trim();
    const emailID = document.getElementById('emailID').value.trim();
    const contactNo = document.getElementById('contactNo').value.trim();
    const address = document.getElementById('address').value.trim();

    // Validate input fields
    if (!studentID || !className || !emailID || !contactNo || !address) {
        alert('Please fill in all fields'); // Alert user if any field is empty
        return;
    }

    if (!validateStudentName(studentName)) {
        alert('Please enter a valid student name (only alphabetic characters).');
        return;
    }

    // Add student record to the table
    addStudentRecord({ studentName, studentID, className, emailID, contactNo, address });

    // Reset form inputs after submission
    form.reset();
}

function validateStudentName(name) {
    return /^[A-Za-z]+$/.test(name);
}

// Function to add a new student record to the table
function addStudentRecord({ studentName, studentID, className, emailID, contactNo, address }) {
    const row = studentTable.insertRow(); // Insert new row in the table body
    row.dataset.id = studentID; // Set data attribute with student ID

    // Populate row cells with student data
    row.innerHTML = `
        <td>${studentName}</td>
        <td>${studentID}</td>
        <td>${className}</td>
        <td>${emailID}</td>
        <td>${contactNo}</td>
        <td>${address}</td>
        <td>
            <button class="edit">Edit</button>
            <button class="delete">Delete</button>
        </td>
    `;

    // Add event listeners to edit and delete buttons in the new row
    const editButton = row.querySelector('.edit');
    const deleteButton = row.querySelector('.delete');

    editButton.addEventListener('click', () => editStudentRecord(row));
    deleteButton.addEventListener('click', () => deleteStudentRecord(row));

    saveToLocalStorage(); // Save updated student records to local storage
    adjustTableWrapperHeight(); // Adjust table wrapper height based on row count
}

// Function to populate form fields for editing a student record
function editStudentRecord(row) {
    // Populate form fields with data from the selected row for editing
    document.getElementById('studentName').value = row.cells[0].innerText;
    document.getElementById('studentID').value = row.cells[1].innerText;
    document.getElementById('class').value = row.cells[2].innerText;
    document.getElementById('emailID').value = row.cells[3].innerText;
    document.getElementById('contactNo').value = row.cells[4].innerText;
    document.getElementById('address').value = row.cells[5].innerText;

    deleteStudentRecord(row); // Delete the selected row after editing
}

// Function to delete a student record from the table
function deleteStudentRecord(row) {
    row.remove(); // Remove the selected row from the table
    saveToLocalStorage(); // Save updated student records to local storage
    adjustTableWrapperHeight(); // Adjust table wrapper height based on row count
}

// Function to save student records to local storage
function saveToLocalStorage() {
    const students = []; // Initialize array to store student records

    // Loop through table rows and populate students array with student objects
    for (let i = 0; i < studentTable.rows.length; i++) {
        const row = studentTable.rows[i];
        const student = {
            studentName: row.cells[0].innerText,
            studentID: row.cells[1].innerText,
            className: row.cells[2].innerText,
            emailID: row.cells[3].innerText,
            contactNo: row.cells[4].innerText,
            address: row.cells[5].innerText,
        };
        students.push(student); // Push each student object to the array
    }

    // Store students array in local storage as a JSON string
    localStorage.setItem('students', JSON.stringify(students));
}

// Function to load existing student records from local storage
function loadFromLocalStorage() {
    const students = JSON.parse(localStorage.getItem('students')) || []; // Retrieve students array from local storage or initialize empty array
    students.forEach(addStudentRecord); // Add each student record to the table on page load
}

// Function to adjust table wrapper height based on the number of rows
function adjustTableWrapperHeight() {
    const tableWrapper = document.querySelector('.table-wrapper'); // Select table wrapper element
    console.log(tableWrapper.clientHeight); // Log current height (for debugging)

    // Adjust table wrapper height and overflow based on the number of rows
    if (studentTable.rows.length > 5) {
        tableWrapper.style.maxHeight = '70vh'; // Set max height with vertical scrollbar
        tableWrapper.style.overflowY = 'scroll'; // Enable vertical scrolling
    } else {
        tableWrapper.style.maxHeight = 'auto'; // Auto height without scrollbar
        tableWrapper.style.overflowY = 'auto'; // Disable scrolling
    }
}
