import {getNumber} from "./counter.js";

let notes;

export function loadNotesFromJSONFile(loadNotesToTable) {
    const jsonFile = 'data.json';

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            notes = data;
            loadNotesToTable(notes);
        })
        .catch(error => {
            console.error('Error occurred during JSON file loading:', error);
        });
}

export function addNote(note) {
    const id = getNumber();
    notes.push({id, ...note, "archived": false});
    return id;
}

export function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
}

export function updateNote(note) {
    const index = getIndexById(note.id);
    const created = notes[index].created;
    const archived = notes[index].archived;
    notes[index] = {created, archived, ...note};
}

export function getNoteById(id) {
    return notes[getIndexById(id)];
}

export function getIndexById(id) {
    return notes.findIndex(note => note.id === id);
}

export function getActiveNotes() {
    return notes.filter(note => !note.archived);
}

export function getActiveIndexById(id) {
    return getActiveNotes().findIndex(note => note.id === id);
}

export function getArchivedNotes() {
    return notes.filter(note => note.archived);
}

export function archiveNote(id) {
    notes[getIndexById(id)].archived = true;
}

export function unarchiveNote(id) {
    notes[getIndexById(id)].archived = false;
}
