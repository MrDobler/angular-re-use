import { Component, OnInit, AfterContentChecked } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

@Component({
    selector: "app-entry-form",
    templateUrl: "./entry-form.component.html",
    styleUrls: ["./entry-form.component.css"]
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
    isEditForm: boolean = false;
    entryForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;
    entry: Entry = new Entry();
    
    constructor(
        private fb: FormBuilder,
        private entryService: EntryService,
        private router: Router,
        private route: ActivatedRoute) {}

    ngOnInit() {
        this.setCurrentAction();
        this.buildEntryForm();
        this.loadEntry();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    save() {
        const entry = Object.assign(new Entry(), this.entryForm.value);
        this.entryService.create(entry).subscribe(
            entry => {
                this.actionsForSuccess(entry)
            },
            error => {
                this.actionsForError(error)
            }
        );
    }

    update() {
        const entry = Object.assign(new Entry(), this.entryForm.value);
        this.entryService.update(entry).subscribe(
            entry => {
                this.actionsForSuccess(entry)
            },
            error => {
                this.actionsForError(error)
            }
        );
    }

    onSubmit() {
        this.submittingForm = true;
        this.isEditForm ? this.update(): this.save();
    }

    private setCurrentAction() {
        this.isEditForm = this.route.snapshot.params.id !== undefined;
    }

    private buildEntryForm() {
        this.entryForm = this.fb.group({
            id: [null],
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['']
        });
    }

    private loadEntry() {
        if (this.isEditForm) {
            this.route.paramMap.pipe(
                switchMap(params => this.entryService.getById(+params.get('id')))
            ).subscribe(
                entry => {
                    this.entry = entry;
                    this.entryForm.patchValue(this.entry);
                },
                err => {
                    console.log('Erro ao salvar entrada.');
                }
            );
        }
    }

    private setPageTitle() {
        if (this.isEditForm) {
            const entryName = this.entry.name || '';
            this.pageTitle = 'Editando Entrada: ' + entryName;
        } else {
            this.pageTitle = 'Cadastro de Nova Entrada';
        }
    }

    private actionsForSuccess(entry: Entry) {
        toastr.success('Entrada salva com sucesso!');
        // this.router.navigateByUrl('entries', { skipLocationChange: true }).
        //     then(
        //         () => this.router.navigate(["entries/form/", entry.id])
        //     );
        this.router.navigateByUrl('entries');
    }

    private actionsForError(error) {
        toastr.error('Erro ao salvar entrada!');
        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Tente mais tarde."];
        }
    }
}
