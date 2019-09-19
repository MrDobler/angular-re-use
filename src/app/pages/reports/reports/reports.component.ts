import { Component, OnInit } from "@angular/core";

@Component({
    selector: "app-reports",
    templateUrl: "./reports.component.html",
    styleUrls: ["./reports.component.css"]
})
export class ReportsComponent implements OnInit {
    breadCrumb = [{ text: 'Relatório de Receitas e Despesas' }];
    constructor() {}

    ngOnInit() {}
}
