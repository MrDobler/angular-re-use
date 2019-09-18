import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-form-field-error', template: `
        <p class="text-danger" style="font-size: 11px" [innerHTML]="errorMessage"></p>
    `, styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {
    @Input('form-control') formControl: AbstractControl;
    @Input('control-name') formControlName: string;
    constructor() {
    }

    ngOnInit() {
    }

    get errorMessage(): string | null {
        if (this.mustShowErrorMessage()) {
            return this.getErrorMessage();
        } else {
            return null;
        }
    }

    private mustShowErrorMessage(): boolean {
        return this.formControl.invalid && this.formControl.touched;
    }

    private getErrorMessage(): string | null {
        if (this.formControl.errors.required) {
            return `O campo <b>${this.formControlName}</b> é obrigatório`;
        } else if (this.formControl.errors.minlength) {
            const requiredLength = this.formControl.errors.minlength.requiredLength;
            return `O campo <b>${this.formControlName}</b> deve ter no mínimo ${requiredLength} caracteres`;
        } else if (this.formControl.errors.minlength) {
            const requiredLength = this.formControl.errors.maxlength.requiredLength;
            return `O campo <b>${this.formControlName}</b> deve ter no máximo ${requiredLength} caracteres`;
        } else if (this.formControl.errors.email) {
            return `Formato de email inválido`;
        }
    }
}
