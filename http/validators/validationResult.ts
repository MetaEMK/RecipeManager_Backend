class ValidationResult {
    public errors?: ValidationError[];
    public validatedData: object;

    public isValid = () => {
        return !this.errors;
    }

    constructor(validatedData: object, errors?: ValidationError[]) {
        this.validatedData = validatedData;
        this.errors = errors;
    }
}