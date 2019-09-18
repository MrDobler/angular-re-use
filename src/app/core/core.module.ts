import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InMemoryDatabase } from '../in-memory-database';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@NgModule({
    declarations: [
        NavBarComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    ],
    exports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        NavBarComponent
    ]
})
export class CoreModule {}
