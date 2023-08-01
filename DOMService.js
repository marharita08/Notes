import {findDates} from "./findDates.js";
import {getCategories} from "./categories.js";
import {addNote, getNoteById, updateNote, deleteNote, getArchivedNotes, countArchivedNoteByCategory,
    loadNotesFromJSONFile, getActiveNotes, archiveNote, unarchiveNote, countActiveNoteByCategory} from "./notes.js";
import {styleDisplay, archiveBtn, element, noteKey, btnClass, eventListenerType,
    activeIdPrefix, archivedIdPrefix, tooltip} from "./strings.js";

// Add/Edit panel
const addEditPanel = document.querySelector("#add-edit-panel");
// Icon buttons
const saveBtn = document.querySelector("#save");
const closeBtn = document.querySelector("#close-panel");
// Inputs and select
const nameInput = document.querySelector("#input-name");
const categorySelect = document.querySelector("#select-category");
const contentInput = document.querySelector("#input-content");
// Table
const archivedTable = document.querySelector("#archived-table");
// Table bodies
const mainTableBody = document.querySelector("#main-table-items");
const summaryTableBody = document.querySelector("#summary-table-items");
const archivedTableBody = document.querySelector("#archived-table-items");
// Buttons
const openCloseArchiveBtn = document.querySelector("#btn-open-close-archive");
const addBtn = document.querySelector("#btn-add");


/*
    Show/hide 'add/edit panel'
*/

function showPanelToAdd() {
    // refresh inputs
    nameInput.value = '';
    categorySelect.selectedIndex = 0;
    contentInput.value = '';
    // make panel visible
    addEditPanel.style.display = styleDisplay.row;
    // change onclick for save icon button
    saveBtn.onclick = saveNewNote;
}

function showPanelToEdit(id) {
    // get note
    const note = getNoteById(id);
    // load note data to inputs
    nameInput.value = note.name;
    categorySelect.value = note.category;
    contentInput.value = note.content;
    // make panel visible
    addEditPanel.style.display = styleDisplay.row;
    // change onclick for save icon button
    saveBtn.onclick = () => saveEditedNote(id);
}

function hidePanel() {
    addEditPanel.style.display = styleDisplay.none;
}

/*
    Show/hide archive table
*/

function openCloseArchiveTable() {
    if (archivedTable.style.display === styleDisplay.none || archivedTable.style.display === styleDisplay.empty) {
        archivedTable.style.display = styleDisplay.table;
        openCloseArchiveBtn.lastChild.data = archiveBtn.close;
    } else {
        archivedTable.style.display = styleDisplay.none;
        openCloseArchiveBtn.lastChild.data = archiveBtn.open;
    }
}

/*
    Create table row and cell
 */

function createTableRow() {
    return document.createElement(element.row);
}

function createTableCell() {
    return document.createElement(element.cell);
}

/*
    Get row common for both main and archive tables
*/

function getCommonRow(note) {
    // create row
    const newRow = createTableRow();
    newRow.id = note.id;

    for (const key in note) {
        if (key !== noteKey.id && key !== noteKey.archived) {
            // create cell
            const cell = createTableCell();
            // add id to cell
            cell.id = key + note.id;
            // add note data to cell
            cell.textContent = note[key];
            // add cell to row
            newRow.appendChild(cell);
        }
    }

    return newRow;
}

/*
    Add, update, remove row in main table
 */

function addNewRowToMainTable(note) {
    // get row common for both main and archive tables
    const newRow = getCommonRow(note);

    // add cells used only for main table
    // create cells
    const updateCell = createTableCell();
    const archiveCell = createTableCell();
    const deleteCell = createTableCell();

    // add icons to cells
    const editIcon = document.querySelector("#edit-cell").innerHTML;
    const archiveIcon = document.querySelector("#archive-cell").innerHTML;
    const deleteIcon = document.querySelector("#delete-cell").innerHTML;
    updateCell.innerHTML = editIcon;
    archiveCell.innerHTML = archiveIcon;
    deleteCell.innerHTML = deleteIcon;

    // add tooltips
    updateCell.title = tooltip.edit;
    archiveCell.title = tooltip.archive;
    deleteCell.title = tooltip.delete;

    // add class to cells
    updateCell.classList.add(btnClass);
    archiveCell.classList.add(btnClass);
    deleteCell.classList.add(btnClass);

    // add onclick functions to each cell
    updateCell.addEventListener(eventListenerType.click, () => showPanelToEdit(note.id));
    archiveCell.addEventListener(eventListenerType.click, () => archiveNoteHandle(note.id));
    deleteCell.addEventListener(eventListenerType.click, () => removeNote(note.id));

    // add cells to row
    newRow.appendChild(updateCell);
    newRow.appendChild(archiveCell);
    newRow.appendChild(deleteCell);

    // add row to table body
    mainTableBody.appendChild(newRow);
}

function updateRowInMainTable(note) {
    for (const key in note) {
        if (key !== noteKey.id && key !== noteKey.archived) {
            document.querySelector(`#${key}${note.id}`).textContent = note[key];
        }
    }
}

function removeRowFromMainTableByNoteId(id) {
    const row = document.getElementById(id);
    mainTableBody.removeChild(row);
}

/*
    Save added note. Handles onclick on save icon if add/edit panel was open using 'Add Note' button
 */

function saveNewNote () {
    // set current date
    const created = new Date().toLocaleDateString();
    // read data from inputs
    const name = nameInput.value;
    const category = categorySelect.value;
    const content = contentInput.value;
    // find dates in content
    const dates = findDates(content);
    // set initial value
    const archived = false;

    // create new note
    let note = {name, created, category, content, dates, archived};
    // add created note to array of notes
    const id = addNote(note);
    note = {id, ...note};
    // write added note to main table
    addNewRowToMainTable(note);

    // recount amount of notes in summary table
    refreshSummaryTable();

    hidePanel();
}

/*
    Save added note. Handles onclick on save icon if add/edit panel was open using edit icon
 */

function saveEditedNote(id) {
    // read values from inputs
    const name = nameInput.value;
    const category = categorySelect.value;
    const content = contentInput.value;
    // find dates in content
    const dates = findDates(content);

    // update note in array
    const note = {id, name, category, content, dates};
    updateNote(note);

    // update note in main table
    updateRowInMainTable(note);
    //hide add/edit panel
    hidePanel();
    // recount amount of notes in summary table
    refreshSummaryTable();
}

/*
    Remove note. Handles onclick on delete icon
 */

function removeNote(id) {
    // remove note from main table
    removeRowFromMainTableByNoteId(id)
    // remove note from array
    deleteNote(id);
    // recount amount of notes in summary table
    refreshSummaryTable();
}

/*
    Archive note. Handles onclick on archive icon
 */

function archiveNoteHandle(id) {
    // delete note from main table
    removeRowFromMainTableByNoteId(id);
    // update note in array
    archiveNote(id);
    // add note to archive
    addNewRowToArchive(getNoteById(id));
    // recount amount of notes in summary table
    refreshSummaryTable();
}

/*
    Add new row to summary table. Used to load initial data
 */

function addNewRowToSummaryTable(category, index) {
    // create new row
    const newRow = createTableRow();

    // create cells
    const categoryCell = createTableCell();
    const activeCountCell = createTableCell();
    const archivedCountCell = createTableCell();

    // fill cells with data
    categoryCell.textContent = category;
    activeCountCell.textContent = countActiveNoteByCategory(category);
    archivedCountCell.textContent = countArchivedNoteByCategory(category);

    // add ids to cells
    activeCountCell.id = activeIdPrefix + index;
    archivedCountCell.id = archivedIdPrefix + index;

    // add cells to row
    newRow.appendChild(categoryCell);
    newRow.appendChild(activeCountCell);
    newRow.appendChild(archivedCountCell);

    // add row to table
    summaryTableBody.appendChild(newRow);
}

/*
    Refresh row in summary table. Used on data change
 */

function refreshRowInSummaryTable(category, index) {
    const activeNotes = countActiveNoteByCategory(category);
    const archivedNotes = countArchivedNoteByCategory(category);
    document.querySelector(`#${archivedIdPrefix}${index}`).textContent = archivedNotes;
    document.querySelector(`#${activeIdPrefix}${index}`).textContent = activeNotes;
}

/*
    Add, remove row in archive table
 */

function addNewRowToArchive(note) {
    const newRow = getCommonRow(note);

    // add unarchive icon button to row
    const unarchiveCell = createTableCell();
    const unarchiveIcon = document.querySelector("#unarchive-cell").innerHTML;
    unarchiveCell.innerHTML = unarchiveIcon;
    unarchiveCell.title = tooltip.unarchive;
    unarchiveCell.classList.add(btnClass);
    unarchiveCell.addEventListener(eventListenerType.click, () => unarchiveNoteHandle(note.id));

    newRow.appendChild(unarchiveCell);

    archivedTableBody.appendChild(newRow);
}

function removeRowFromArchiveByNoteId(id) {
    const row = document.getElementById(id);
    archivedTableBody.removeChild(row);
}

/*
    Unarchive note. Handles onclick on unarchive icon
 */

function unarchiveNoteHandle(id) {
    // delete note from archive table
    removeRowFromArchiveByNoteId(id);
    // add note to main table
    addNewRowToMainTable(getNoteById(id));
    // update note in array
    unarchiveNote(id);
    // recount amount of notes in summary table
    refreshSummaryTable();
}

/*
    Load categories into select
 */

function fillSelectWithCategories() {
    getCategories().forEach(category => {
        const option = document.createElement(element.option);
        option.text = category;
        categorySelect.add(option);
    })
}

/*
    Load initial data into tables
 */

function loadNotesIntoTable() {
    // show each active note in main table
    getActiveNotes().forEach(note => addNewRowToMainTable(note));
}

function loadArchivedNotesIntoTable() {
    // add each archived note to archive table
    getArchivedNotes().forEach(note => addNewRowToArchive(note));
}

function fillSummaryTable() {
    // add each category to summary table
    getCategories().forEach((category, index) => addNewRowToSummaryTable(category, index));
}

/*
    Refresh summary table
 */

function refreshSummaryTable() {
    // refresh each row in summary table
    getCategories().forEach((category, index) => {
        refreshRowInSummaryTable(category, index);
    });
}

/*
    Add event listeners
 */
document.addEventListener(eventListenerType.loaded, () => {
    loadNotesFromJSONFile([loadNotesIntoTable, fillSummaryTable, loadArchivedNotesIntoTable]);
    fillSelectWithCategories();
});
addBtn.addEventListener(eventListenerType.click, showPanelToAdd);
closeBtn.addEventListener(eventListenerType.click, hidePanel);
openCloseArchiveBtn.addEventListener(eventListenerType.click, openCloseArchiveTable);
