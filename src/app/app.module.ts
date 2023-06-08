import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HomeComponent } from './components/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ResultComponent } from './components/result/result.component';

@NgModule({
  declarations: [
    HomeComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [HomeComponent]
})
export class AppModule { }
