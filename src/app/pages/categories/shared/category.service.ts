import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Category } from "./category.model";

@Injectable({
    providedIn: "root"
})
export class CategoryService {
    private readonly api: string = "api/categories";

    constructor(
      private http: HttpClient
    ) {}

    all(): Observable<Category[]> {
        return this.http.get(this.api).pipe(
            catchError(this.handleErrors),
            map(this.jsonDataToCategories)
        );
    }

    getById(id: number): Observable<Category> {
        const url = `${this.api}/${id}`
        return this.http.get(url).pipe(
            catchError(this.handleErrors),
            map(this.jsonDataToCategory)
        );
    }

    create(category: Category): Observable<Category> {
        return this.http.post(this.api, category).pipe(
            catchError(this.handleErrors),
            map(this.jsonDataToCategory)
        );
    }

    update(category: Category): Observable<Category> {
        const url = `${this.api}/${category.id}`
        return this.http.put(url, category).pipe(
            catchError(this.handleErrors),
            map(() => category)
        );
    }

    delete(id: number): Observable<Category> {
        const url = `${this.api}/${id}`
        return this.http.delete(url).pipe(
            catchError(this.handleErrors),
            map(() => null)
        );
    }

    private jsonDataToCategories(jsonData: any[]): Category[] {
        const categories: Category[] = [];
        jsonData.forEach(element => categories.push(element as Category));
        return categories;
    }

    private jsonDataToCategory(jsonData: any): Category {
        return jsonData as Category;
    }

    private handleErrors(error: any): Observable<any> {
        console.log("Erro na requisição -> ", error);
        return throwError(error);
    }
}

