import { Component, OnInit } from "@angular/core";

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

@Component({
    selector: "app-category-list",
    templateUrl: "./category-list.component.html",
    styleUrls: ["./category-list.component.css"]
})
export class CategoryListComponent implements OnInit {
    categories: Category[] = [];
    isLoading = false;
    constructor(private categoryService: CategoryService) {}

    ngOnInit() {
        this.isLoading = true;
        this.categoryService.all().subscribe(
            categories => {
                this.categories = categories;
                this.isLoading = false;
            },
            err => {
                console.log('Erro!');
                this.isLoading = false;
            }
        );
    }

    deleteCategory(category: Category) {
        const mustConfirm = confirm("Excluir categoria?");

        if (mustConfirm) {
            this.isLoading = true;
            this.categoryService.delete(category.id).subscribe(
                () => {
                    this.categories = this.categories.filter(el => el != category);
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
