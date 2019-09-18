import { OnInit } from "@angular/core";
import { BaseResource } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';


export abstract class BaseResourceListComponent<T extends BaseResource> implements OnInit {
    resources: T[] = [];
    isLoading = false;
    constructor(
        protected resourceService: BaseResourceService<T>
    ) {}

    ngOnInit() {
        this.isLoading = true;
        this.resourceService.all().subscribe(
            resources => {
                this.resources = resources;
                this.isLoading = false;
            },
            err => {
                console.log('Erro!');
                this.isLoading = false;
            }
        );
    }

    deleteResource(resource: T) {
        const mustConfirm = confirm("Excluir categoria?");

        if (mustConfirm) {
            this.isLoading = true;
            this.resourceService.delete(resource.id).subscribe(
                () => {
                    this.resources = this.resources.filter(el => el != resource);
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
