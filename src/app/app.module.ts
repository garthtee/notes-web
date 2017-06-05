import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';

import { NotesService } from './notes.service';
import { SnotifyModule, SnotifyService } from 'ng-snotify';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SnotifyModule
  ],
  providers: [NotesService, SnotifyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
