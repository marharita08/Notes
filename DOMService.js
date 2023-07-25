import {findDates} from "./findDates.js";
import {addNote, notes} from "./notes.js";

const saveBtn = document.querySelector("#save");
const mainTableBody = document.querySelector("#main-table-items");
const addEditPanel = document.querySelector("#add-edit-panel");
const addBtn = document.querySelector("#btn-add");
const closeBtn = document.querySelector("#close-panel");

function showPanel() {
    addEditPanel.style.display = "table-row-group";
}

function hidePanel() {
    addEditPanel.style.display = "none";
}

function addNewNote () {
    const name = document.querySelector("#input-name").value;
    const created = new Date();
    const category = document.querySelector("#select-category").value;
    const content = document.querySelector("#input-content").value;
    const dates = findDates(content);

    const id = addNote({name, created, category, content, dates});

    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const createdCell = document.createElement('td');
    const categoryCell = document.createElement('td');
    const contentCell = document.createElement('td');
    const datesCell = document.createElement('td');
    const updateCell = document.createElement('td');
    const archiveCell = document.createElement('td');
    const deleteCell = document.createElement('td');

    nameCell.textContent = name;
    createdCell.textContent = created.toLocaleDateString();
    categoryCell.textContent = category;
    contentCell.textContent = content;
    datesCell.textContent = dates;
    updateCell.innerHTML = "<i class=\"fa fa-pencil\"></i>";
    archiveCell.innerHTML = "<i class=\"fa fa-archive\"></i>";
    deleteCell.innerHTML = "<i class=\"fa fa-trash\"></i>";

    const btnClass = "btn"
    updateCell.classList.add(btnClass);
    archiveCell.classList.add(btnClass);
    deleteCell.classList.add(btnClass);

    newRow.appendChild(nameCell);
    newRow.appendChild(createdCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(contentCell);
    newRow.appendChild(datesCell);
    newRow.appendChild(updateCell);
    newRow.appendChild(archiveCell);
    newRow.appendChild(deleteCell);

    mainTableBody.appendChild(newRow);
    hidePanel();
}

saveBtn.addEventListener('click', addNewNote);
addBtn.addEventListener('click', showPanel);
closeBtn.addEventListener('click', hidePanel);
