import {getNumber} from "./counter.js";
export let notes = [];

export function addNote(note) {
    const id = getNumber()
    notes.push({id, ...note});
    return id;
}

export function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
}

export function updateNote(note) {
    const index = notes.findIndex((currNote => currNote.id === note.id));
    notes[index] = [...note];
}
