import { PositionInFile } from 'tslint/lib/test/lintError';
import { Component, OnInit } from '@angular/core';
import { NotesService } from '../notes.service';

// Import SnotifyService
import {SnotifyService, SnotifyPosition} from 'ng-snotify';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

  showAlert = false;
  noteInput: string = null;
  notes: any = [];
  position = SnotifyPosition.center_center;

  constructor(private notesService: NotesService, private snotifyService: SnotifyService) {}

  ngOnInit() {
    this.updateNotes();

    this.snotifyService.setConfig({
      timeout: 30000
    }, {
      newOnTop: false,
      position: this.position
    });
  }

  // Hopefuly you can add a toast
  addUpdatenoteToast(note, callback) {
    const id = this.snotifyService.prompt('Update ' + note, '', {
      buttons: [
        {text: 'Update', action: (text) => {if (text) { callback(text); }}, bold: false},
        {text: 'Cancel', action: () => this.snotifyService.remove(id), bold: true },
      ],
      placeholder: 'Enter note',
      closeOnClick: false,
      timeout: 0,
      showProgressBar: false
    });
  }

  // You can remove all toasts from the field
  clearToasts() {
    this.snotifyService.clear();
  }

  updateNotes() {
    // Retrieve notes from the API
    this.notesService.getAllNotes().subscribe(notes => {
      this.notes = notes;
    });
  }

  onNoteInput() {
    if (this.noteInput) {
      this.showAlert = false;

      this.notesService.addNote(this.noteInput).subscribe(err => {
        // console.log(err);
      });
      this.noteInput = null;
      this.updateNotes();
    } else {
      this.showAlert = true;
    }
  }

  deleteNote(noteId) {
    this.notesService.deleteNote(noteId).subscribe(err => {
        // console.log(err);
      });
    this.updateNotes();
  }

  editNote(noteId, noteBody) {
    this.addUpdatenoteToast(noteBody, text => {
      this.notesService.editNote(noteId, text).subscribe(err => {
        // console.log(err);
      });
      this.updateNotes();
      this.clearToasts();
    });
  }
}
