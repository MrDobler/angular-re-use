import { Component, Injector, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import toastr from "toastr";
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
    selector: "app-entry-form",
    templateUrl: "./entry-form.component.html",
    styleUrls: ["./entry-form.component.css"]
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {

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
        protected entryService: EntryService,
        protected categoryService: CategoryService,
        protected injector: Injector) {
            super(injector, new Entry(), entryService, Entry.fromJson);
        }

    ngOnInit() {
        super.ngOnInit();
        this.loadCategories();
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

    protected buildResourceForm() {
        this.resourceForm = this.fb.group({
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

    private loadCategories() {
        this.isLoading = true;
        this.categoryService.all().subscribe(
            categories => {
                this.categories = categories;
                this.isLoading = false;
            },
            err => {
                toastr.success("Erro ao carregar categorias");
                this.isLoading = false;
            }
        )
    }

    protected setPageTitle() {
        if (this.isEditForm) {
            const entryName = this.resource.name || '';
            this.pageTitle = 'Editando Lançamento: ' + entryName;
        } else {
            this.pageTitle = 'Cadastro de Nova Lançamento';
        }
    }
}
