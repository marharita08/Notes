# Notes

The Notes App is a JavaScript-based application that allows users to manage their notes effectively. Users can add, edit, and delete notes, which are displayed in the form of a table. Additionally, notes can be archived and unarchived for better organization. Archived notes are displayed in a separate table, which is hidden by default.

## Features

- **Add Note**: Users can create new notes by providing a name, category and content. Once added, the note will appear in the main table.
- **Edit Note**: Existing active notes can be edited to update their name, category or content. 
- **Delete Note**: If a note is no longer needed, users can delete it from the main table.
- **Archive Note**: Users can archive a note to move it from the main table to the archived table. 
- **Unarchive Note**: If needed, archived notes can be unarchived and returned to the main table. The unarchived note will be available for regular editing and viewing.

## Installation

As the Notes App is a front-end application that interacts with the browser, you may encounter Cross-Origin Resource Sharing (CORS) issues when trying to open it directly from the file system. To run the app, you should set up a local development server. Here's how you can do it using Python:

1. Make sure you have Python installed on your system.
2. Open the terminal or command prompt.
3. Clone project from repository `git clone https://github.com/marharita08/Notes`
4. Navigate to the project directory containing the index.html file.
5. Start a simple HTTP server using Python:
     - For Python 2: `python -m SimpleHTTPServer 8000`;
     - For Python 3: `python -m http.server 8000`.
6. Once the server is running, open your web browser and go to `http://localhost:8000/`. 

## Usage

1. **Add a New Note**
   - Click on the "Add Note" button.
   - Enter a name and content, choose category for the new note.
   - Click "Save" icon to add the note to the main table.

2. **Edit a Note**
   - In the main table, locate the note you wish to edit.
   - Click "Edit" icon to copy note to edit panel.
   - Make the necessary changes.
   - Click "Save" icon to apply the modifications.

3. **Delete a Note**
   - In the main table, find the note you want to delete.
   - Click the "Delete" icon associated with the note.

4. **Archive/Unarchive a Note**
   - In the main table, locate the note you want to archive.
   - Click the "Archive" icon associated with the note to move it to the archived table.
   - In the archived table, locate the note you want to unarchive.
   - Click the "Unarchive" icon associated with the note to move it back to the main table.

## Screenshots

![Screenshot 1](screenshots/Screenshot_1.png)
![Screenshot 2](screenshots/Screenshot_2.png)
