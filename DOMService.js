import {findDates} from "./findDates.js";
import {getCategories} from "./categories.js";
import {addNote, getNoteById, updateNote, deleteNote, countNotesByCategoryAndArchived,
    getActiveIndexById, loadNotesFromJSONFile, getActiveNotes, archiveNote} from "./notes.js";

const saveBtn = document.querySelector("#save");
const mainTableBody = document.querySelector("#main-table-items");
const addEditPanel = document.querySelector("#add-edit-panel");
const addBtn = document.querySelector("#btn-add");
const closeBtn = document.querySelector("#close-panel");
const nameInput = document.querySelector("#input-name");
const categorySelect = document.querySelector("#select-category");
const contentInput = document.querySelector("#input-content");
const summaryTableBody = document.querySelector("#summary-table-items");

const nameIdPrefix = "name";
const categoryIdPrefix = "category";
const contentIdPrefix = "content";
const datesIdPrefix = "dates";
const activeIdPrefix = "active";
const archivedIdPrefix = "archived";

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
    getActiveNotes().forEach(note => addNewRowToMainTable(note));
}

function saveNewNote () {
    const name = nameInput.value;
    const created = new Date().toLocaleDateString();
    const category = categorySelect.value;
    const content = contentInput.value;
    const dates = findDates(content);
    const archived = false;

    let note = {name, created, category, content, dates, archived};
    const id = addNote(note);
    note = {id, ...note};
    addNewRowToMainTable(note);

    refreshSummaryTable();

    hidePanel();
}

function addNewRowToMainTable(note) {
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
    archiveCell.addEventListener('click', () => archiveNoteHandle(note.id));
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
    refreshSummaryTable();
}

function removeNote(id) {
    mainTableBody.deleteRow(getActiveIndexById(id));
    deleteNote(id);
    refreshSummaryTable();
}

function archiveNoteHandle(id) {
    mainTableBody.deleteRow(getActiveIndexById(id));
    archiveNote(id);
    refreshSummaryTable();
}

function fillSelectWithCategories() {
    getCategories().forEach(category => {
        const option = document.createElement("option");
        option.text = category;
        categorySelect.add(option);
    })
}

function fillSummaryTable() {
    getCategories().forEach((category, index) => addNewRowToSummaryTable(category, index));
}

function addNewRowToSummaryTable(category, index) {
    const newRow = document.createElement('tr');

    const categoryCell = document.createElement('td');
    const activeCountCell = document.createElement('td');
    const archivedCountCell = document.createElement('td');

    categoryCell.textContent = category;
    activeCountCell.textContent = countNotesByCategoryAndArchived(category, false);
    archivedCountCell.textContent = countNotesByCategoryAndArchived(category, true);

    activeCountCell.id = activeIdPrefix + index;
    archivedCountCell.id = archivedIdPrefix + index;

    newRow.appendChild(categoryCell);
    newRow.appendChild(activeCountCell);
    newRow.appendChild(archivedCountCell);

    summaryTableBody.appendChild(newRow);
}

function refreshSummaryTable() {
    getCategories().forEach((category, index) => {
        refreshCellInSummaryTable(category, index);
    });
}

function refreshCellInSummaryTable(category, index) {
    const activeNotes = countNotesByCategoryAndArchived(category, false);
    const archivedNotes = countNotesByCategoryAndArchived(category, true);
    document.querySelector(`#${archivedIdPrefix}${index}`).textContent = archivedNotes;
    document.querySelector(`#${activeIdPrefix}${index}`).textContent = activeNotes;
}

document.addEventListener("DOMContentLoaded", () => {
    loadNotesFromJSONFile(loadNotesToTable, fillSummaryTable);
    fillSelectWithCategories();
});
addBtn.addEventListener('click', showPanelToAdd);
closeBtn.addEventListener('click', hidePanel);
