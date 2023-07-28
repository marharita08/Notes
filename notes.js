import {getNumber} from "./counter.js";
/*
    Array of notes
 */

let notes;

export function loadNotesFromJSONFile(functions) {
    const jsonFile = 'data.json';

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            notes = data;
            functions.forEach(fn => fn());
        })
        .catch(error => {
            console.error('Error occurred during JSON file loading:', error);
        });
}

export function addNote(note) {
    const id = getNumber();
    notes.push({id, ...note});
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

export function getArchivedNotes() {
    return notes.filter(note => note.archived);
}

export function archiveNote(id) {
    notes[getIndexById(id)].archived = true;
}

export function unarchiveNote(id) {
    notes[getIndexById(id)].archived = false;
}

export function countActiveNoteByCategory(category) {
    return notes.filter(note => note.category === category && !note.archived).length
}

export function countArchivedNoteByCategory(category) {
    return notes.filter(note => note.category === category && note.archived).length
}
