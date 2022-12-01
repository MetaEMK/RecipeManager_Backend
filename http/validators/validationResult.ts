import { Branch } from '../../data/entities/branch.entity.js';
import { ValidationError } from './validationError.js';
export class ValidationResult {
    public errors?: ValidationError[];
    public validatedData?: object;

    public isValid = () => {
        return !this.errors;
    }
    public getValidatedData = () => {
        if(this.validatedData typeof Branch) return this.validatedData as Branch;
    }
}