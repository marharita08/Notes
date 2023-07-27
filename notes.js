import {getNumber} from "./counter.js";
export let notes;

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
    notes.push({id, ...note});
    return id;
}

export function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
}

export function updateNote(note) {
    const index = getIndexById(note.id);
    const created = notes[index].created;
    notes[index] = {created, ...note};
}

export function getNoteById(id) {
    return notes[getIndexById(id)];
}

export function getIndexById(id) {
    return notes.findIndex(note => note.id === id);
}
