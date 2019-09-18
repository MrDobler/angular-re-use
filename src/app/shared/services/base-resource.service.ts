import { HttpClient } from "@angular/common/http";
import { Injector } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { BaseResource } from '../models/base-resource.model';

export abstract class BaseResourceService<T extends BaseResource> {

    protected http: HttpClient;

    constructor(
        protected api: string,
        protected injector: Injector,
        protected jsonDataToResourceFn: (jsonData: any) => T) {
        this.http = injector.get(HttpClient);
    }

    all(): Observable<T[]> {
        return this.http.get(this.api).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleErrors)
        );
    }

    getById(id: number): Observable<T> {
        const url = `${this.api}/${id}`
        return this.http.get(url).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleErrors),
        );
    }

    create(resource: T): Observable<T> {
        return this.http.post(this.api, resource).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleErrors)
        );
    }

    update(resource: T): Observable<T> {
        const url = `${this.api}/${resource.id}`
        return this.http.put(url, resource).pipe(
            map(() => resource),
            catchError(this.handleErrors)
        );
    }

    delete(id: number): Observable<T> {
        const url = `${this.api}/${id}`;
        return this.http.delete(url).pipe(
            map(() => null),
            catchError(this.handleErrors)
        );
    }

    protected jsonDataToResources(jsonData: any[]): T[] {
        const categories: T[] = [];
        jsonData.forEach(element => categories.push(this.jsonDataToResourceFn(element)));
        return categories;
    }

    protected jsonDataToResource(jsonData: any): T {
        return this.jsonDataToResourceFn(jsonData);
    }

    protected handleErrors(error: any): Observable<any> {
        console.log("Erro na requisição -> ", error);
        return throwError(error);
    }
}
