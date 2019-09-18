import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-page-header',
    templateUrl: './page-header.component.html',
    styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {
    @Input('page-title') pageTitle: string;
    @Input('button-class') btnClass: string;
    @Input('button-text') btnText: string;
    @Input('button-link') btnLink: string;

    constructor() {
    }

    ngOnInit() {
    }

}
