import { Component, OnInit } from "@angular/core";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

@Component({
    selector: "app-entry-list",
    templateUrl: "./entry-list.component.html",
    styleUrls: ["./entry-list.component.css"]
})
export class EntryListComponent implements OnInit {
    entries: Entry[] = [];
    isLoading = false;
    constructor(private entryService: EntryService) {}

    ngOnInit() {
        this.isLoading = true;
        this.entryService.all().subscribe(
            entries => {
                this.entries = entries;
                this.isLoading = false;
            },
            err => {
                console.log('Erro!');
                this.isLoading = false;
            }
        );
    }

    deleteEntry(entry: Entry) {
        const mustConfirm = confirm("Excluir lançamento?");

        if (mustConfirm) {
            this.isLoading = true;
            this.entryService.delete(entry.id).subscribe(
                () => {
                    this.entries = this.entries.filter(el => el != entry);
                    this.isLoading = false;
                },
                err => {
                    console.log("Erro ao deletar");
                    this.isLoading = false;
                }
            );
        }
    }
}
