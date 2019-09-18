import { OnInit, AfterContentChecked, Injector } from "@angular/core";
import {
    FormBuilder,
    FormGroup,
    Validators
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

import { BaseResource } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceFormComponent<T extends BaseResource>
    implements OnInit, AfterContentChecked {

    isLoading: boolean = false;
    isEditForm: boolean = false;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected fb: FormBuilder;

    constructor(
        protected injector: Injector,
        public resource: T,
        private resourceService: BaseResourceService<T>,
        protected jsonDataToResourceFn: (jsonData: any) => T
    ) {
        this.route = this.injector.get(ActivatedRoute);
        this.router = this.injector.get(Router);
        this.fb = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    save(): void {
        this.isLoading = true;
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.create(resource).subscribe(
            resource => {
                this.actionsForSuccess(resource);
                this.isLoading = false;
            },
            error => {
                this.actionsForError(error);
                this.isLoading = false;
            }
         );
    }

    update() {
        this.isLoading = true;
        const resource = this.jsonDataToResourceFn(this.resourceForm.value);
        this.resourceService.update(resource).subscribe(
            resource => {
                this.actionsForSuccess(resource);
                this.isLoading = false;
            },
            error => {
                this.actionsForError(error);
                this.isLoading = false;
            }
        );
    }

    onSubmit() {
        this.submittingForm = true;
        this.isEditForm ? this.update(): this.save();
    }

    protected setCurrentAction() {
        this.isEditForm = this.route.snapshot.params.id !== undefined;
    }

    protected loadResource() {
        if (this.isEditForm) {
            this.isLoading = true;
            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById(+params.get('id')))
            ).subscribe(
                resource => {
                    this.resource = resource;
                    this.resourceForm.patchValue(this.resource);
                    this.isLoading = false;
                },
                err => {
                    console.log('Erro ao salvar categoria.');
                    this.isLoading = false;
                }
            );
        }
    }

    protected setPageTitle() {
        if (this.isEditForm) {
            this.pageTitle = 'Editando Categoria';
        } else {
            this.pageTitle = 'Cadastro de Nova Categoria';
        }
    }

    protected actionsForSuccess(resource: T) {
        toastr.success('Categoria salva com sucesso!');
        this.router.navigateByUrl(this.route.snapshot.parent.url[0].path);
    }

    protected actionsForError(error) {
        toastr.error('Erro ao salvar!');
        this.submittingForm = false;

        if (error.status === 422) {
            this.serverErrorMessages = JSON.parse(error._body).errors;
        } else {
            this.serverErrorMessages = ["Falha na comunicação com o servidor. Tente mais tarde."];
        }
    }

    protected abstract buildResourceForm(): void;
}
