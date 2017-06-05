import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class NotesService {

  constructor(private http: Http) { }

  // Get all notes from the API
  getAllNotes() {
    return this.http.get('http://localhost:3000/api/notes')
      .map(res => res.json());
  }

  addNote(noteIn) {
    return this.http.get('http://localhost:3000/api/addNote/' + noteIn)
      .map(res => res.json());
  }

  deleteNote(noteId) {
    return this.http.get('http://localhost:3000/api/deleteNote/' + noteId)
      .map(res => res.json());
  }

  editNote(noteId, noteBody) {
    return this.http.get('http://localhost:3000/api/editNote/' + noteId + '/' + noteBody).map(res => res.json());
  }
}
