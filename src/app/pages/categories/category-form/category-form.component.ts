import { Component, OnInit, AfterContentChecked } from "@angular/core";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

@Component({
    selector: "app-category-form",
    templateUrl: "./category-form.component.html",
    styleUrls: ["./category-form.component.css"]
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {
    isEditForm: boolean = false;
    categoryForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;
    category: Category = new Category();
    
    constructor(
        private fb: FormBuilder,
        private categoryService: CategoryService,
        private router: Router,
        private route: ActivatedRoute) {}

    ngOnInit() {
        this.setCurrentAction();
        this.buildCategoryForm();
        this.loadCategory();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    save() {
        const category = Object.assign(new Category(), this.categoryForm.value);
        this.categoryService.create(category).subscribe(
            category => {
                this.actionsForSuccess(category)
            },
            error => {
                this.actionsForError(error)
            }
        );
    }

    update() {
        const category = Object.assign(new Category(), this.categoryForm.value);
        this.categoryService.update(category).subscribe(
            category => {
                this.actionsForSuccess(category)
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

    private buildCategoryForm() {
        this.categoryForm = this.fb.group({
            id: [null],
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['']
        });
    }

    private loadCategory() {
        if (this.isEditForm) {
            this.route.paramMap.pipe(
                switchMap(params => this.categoryService.getById(+params.get('id')))
            ).subscribe(
                category => {
                    this.category = category;
                    this.categoryForm.patchValue(this.category);
                },
                err => {
                    console.log('Erro ao salvar categoria.');
                }
            );
        }
    }

    private setPageTitle() {
        if (this.isEditForm) {
            const categoryName = this.category.name || '';
            this.pageTitle = 'Editando Categoria: ' + categoryName;
        } else {
            this.pageTitle = 'Cadastro de Nova Categoria';
        }
    }

    private actionsForSuccess(category: Category) {
        toastr.success('Categoria salva com sucesso!');
        // this.router.navigateByUrl('categories', { skipLocationChange: true }).
        //     then(
        //         () => this.router.navigate(["categories/form/", category.id])
        //     );
        this.router.navigateByUrl('categories');
    }

    private actionsForError(error) {
        toastr.error('Erro ao salvar categoria!');
        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Tente mais tarde."];
        }
    }
}
