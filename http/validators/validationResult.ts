import { ValidationError } from './validationError.js';
export class ValidationResult {
    public errors?: ValidationError[];
    public validatedData?: object;

    public isValid = () => {
        return !this.errors;
    }
}