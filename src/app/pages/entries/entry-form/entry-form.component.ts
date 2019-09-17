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
import { Category } from '../../categories/shared/category.model';

import { switchMap } from "rxjs/operators";
import toastr from "toastr";
import { CategoryService } from '../../categories/shared/category.service';

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
    categories: Category[] = [];

    imaskConfig = {
        mask: Number,
        scale: 2,
        thousandsSeparator: '',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ','
    };

    ptBR = {
        firstDayOfWeek: 0,
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
        monthNames: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
          'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        today: 'Hoje',
        clear: 'Limpar'
    };
    
    constructor(
        private fb: FormBuilder,
        private entryService: EntryService,
        private router: Router,
        private route: ActivatedRoute,
        private categoryService: CategoryService) {}

    ngOnInit() {
        this.setCurrentAction();
        this.buildEntryForm();
        this.loadEntry();
        this.loadCategories();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    save() {
        const entry = Entry.fromJson(this.entryForm.value);
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
        const entry = Entry.fromJson(this.entryForm.value);
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
    
    get typeOptions(): Array<any> {
        return Object.entries(Entry.types).map(
            ([value, text]) => {
                return {
                    text: text,
                    value: value
                };
            }
        )
    }

    private setCurrentAction() {
        this.isEditForm = this.route.snapshot.params.id !== undefined;
    }

    private buildEntryForm() {
        this.entryForm = this.fb.group({
            id: [null],
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: [''],
            type: ['', [Validators.required]],
            date: ['', [Validators.required]],
            paid: [true , [Validators.required]],
            amount: [null , [Validators.required]],
            category_id: [null , [Validators.required]],
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
                    console.log('Erro ao salvar lançamento.');
                }
            );
        }
    }

    private loadCategories() {
        this.categoryService.all().subscribe(
            categories => this.categories = categories,
            err => toastr.success("Erro ao carregar categorias")
        )
    }

    private setPageTitle() {
        if (this.isEditForm) {
            const entryName = this.entry.name || '';
            this.pageTitle = 'Editando Lançamento: ' + entryName;
        } else {
            this.pageTitle = 'Cadastro de Nova Lançamento';
        }
    }

    private actionsForSuccess(entry: Entry) {
        toastr.success('Lançamento salva com sucesso!');
        // this.router.navigateByUrl('entries', { skipLocationChange: true }).
        //     then(
        //         () => this.router.navigate(["entries/form/", entry.id])
        //     );
        this.router.navigateByUrl('entries');
    }

    private actionsForError(error) {
        toastr.error('Erro ao salvar lançamento!');
        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Tente mais tarde."];
        }
    }
}
