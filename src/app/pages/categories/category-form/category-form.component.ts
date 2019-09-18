import { Component, Injector } from "@angular/core";
import { Validators } from "@angular/forms";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
    selector: "app-category-form",
    templateUrl: "./category-form.component.html",
    styleUrls: ["./category-form.component.css"]
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

    constructor(
        protected categoryService: CategoryService,
        protected injector: Injector
    ) {
        super(injector, new Category(), categoryService, Category.fromJson);
    }

    protected buildResourceForm(): void {
        this.resourceForm = this.fb.group({
            id: [null],
            name: ['', [Validators.required, Validators.minLength(3)]],
            description: ['']
        });
    }

    protected setPageTitle() {
        if (this.isEditForm) {
            const entryName = this.resource.name || '';
            this.pageTitle = 'Editando Categoria: ' + entryName;
        } else {
            this.pageTitle = 'Cadastro de Nova Categoria';
        }
    }
}
