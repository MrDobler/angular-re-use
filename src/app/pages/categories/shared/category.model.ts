import { BaseResource } from 'src/app/shared/models/base-resource.model';

export class Category extends BaseResource {
    constructor(
        public id?: number,
        public name?: string,
        public description?: string
    ) {
        super();
    }
}