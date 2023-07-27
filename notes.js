import {getNumber} from "./counter.js";
export let notes;

export function loadNotesFromJSONFile(fn) {
    const jsonFile = 'data.json';

    fetch(jsonFile)
        .then(response => response.json())
        .then(data => {
            notes = data;
            fn(notes);
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
    const index = notes.findIndex((currNote => currNote.id === note.id));
    const created = notes[index].created;
    notes[index] = {created, ...note};
}

export function getNoteById(id) {
    return notes[notes.findIndex(note => note.id === id)];
}
