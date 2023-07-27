import {findDates} from "./findDates.js";
import {addNote, getNoteById, updateNote, deleteNote, getIndexById, loadNotesFromJSONFile, notes} from "./notes.js";

const saveBtn = document.querySelector("#save");
const mainTableBody = document.querySelector("#main-table-items");
const addEditPanel = document.querySelector("#add-edit-panel");
const addBtn = document.querySelector("#btn-add");
const closeBtn = document.querySelector("#close-panel");
const nameInput = document.querySelector("#input-name");
const categorySelect = document.querySelector("#select-category");
const contentInput = document.querySelector("#input-content");

const nameIdPrefix = "name";
const categoryIdPrefix = "category";
const contentIdPrefix = "content";
const datesIdPrefix = "dates";

function showPanelToAdd() {
    nameInput.value = '';
    categorySelect.selectedIndex = 0;
    contentInput.value = '';
    addEditPanel.style.display = "table-row-group";
    saveBtn.onclick = saveNewNote;
}

function showPanelToEdit(id) {
    const note = getNoteById(id);
    nameInput.value = note.name;
    categorySelect.value = note.category;
    contentInput.value = note.content;
    addEditPanel.style.display = "table-row-group";
    saveBtn.onclick = () => saveEditedNote(id);
}

function hidePanel() {
    addEditPanel.style.display = "none";
}

function loadNotesToTable() {
    notes.forEach(note => addNewRow(note));
}

function saveNewNote () {
    const name = nameInput.value;
    const created = new Date().toLocaleDateString();
    const category = categorySelect.value;
    const content = contentInput.value;
    const dates = findDates(content);

    let note = {name, created, category, content, dates};
    const id = addNote(note);
    note = {id, ...note};
    addNewRow(note);

    hidePanel();
}

function addNewRow(note) {
    const newRow = document.createElement('tr');

    const nameCell = document.createElement('td');
    const createdCell = document.createElement('td');
    const categoryCell = document.createElement('td');
    const contentCell = document.createElement('td');
    const datesCell = document.createElement('td');
    const updateCell = document.createElement('td');
    const archiveCell = document.createElement('td');
    const deleteCell = document.createElement('td');

    nameCell.id = nameIdPrefix + note.id;
    categoryCell.id = categoryIdPrefix + note.id;
    contentCell.id = contentIdPrefix + note.id;
    datesCell.id = datesIdPrefix + note.id;

    nameCell.textContent = note.name;
    createdCell.textContent = note.created;
    categoryCell.textContent = note.category;
    contentCell.textContent = note.content;
    datesCell.textContent = note.dates;
    updateCell.innerHTML = "<i class=\"fa fa-pencil\"></i>";
    archiveCell.innerHTML = "<i class=\"fa fa-archive\"></i>";
    deleteCell.innerHTML = "<i class=\"fa fa-trash\"></i>";

    const btnClass = "btn"
    updateCell.classList.add(btnClass);
    archiveCell.classList.add(btnClass);
    deleteCell.classList.add(btnClass);

    updateCell.addEventListener('click', () => showPanelToEdit(note.id));
    deleteCell.addEventListener('click', () => removeNote(note.id));

    newRow.appendChild(nameCell);
    newRow.appendChild(createdCell);
    newRow.appendChild(categoryCell);
    newRow.appendChild(contentCell);
    newRow.appendChild(datesCell);
    newRow.appendChild(updateCell);
    newRow.appendChild(archiveCell);
    newRow.appendChild(deleteCell);

    mainTableBody.appendChild(newRow);
}

function saveEditedNote(id) {
    const name = nameInput.value;
    const category = categorySelect.value;
    const content = contentInput.value;
    const dates = findDates(content);

    updateNote({id, name, category, content, dates});

    document.querySelector(`#${nameIdPrefix}${id}`).textContent = name;
    document.querySelector(`#${categoryIdPrefix}${id}`).textContent = category;
    document.querySelector(`#${contentIdPrefix}${id}`).textContent = content;
    document.querySelector(`#${datesIdPrefix}${id}`).textContent = dates;

    hidePanel();
}

function removeNote(id) {
    mainTableBody.deleteRow(getIndexById(id));
    deleteNote(id);
}

document.addEventListener("DOMContentLoaded", () => loadNotesFromJSONFile(loadNotesToTable));
addBtn.addEventListener('click', showPanelToAdd);
closeBtn.addEventListener('click', hidePanel);
