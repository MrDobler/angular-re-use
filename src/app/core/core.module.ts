import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { InMemoryDatabase } from '../in-memory-database';
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";

@NgModule({
    declarations: [
    ],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientInMemoryWebApiModule.forRoot(InMemoryDatabase),
    ],
    exports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
    ]
})
export class CoreModule {}
