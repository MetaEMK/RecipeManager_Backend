/**
 * Simple ingredient interface with schema.
 * 
 * Used for checking ingredients send by a request body.
 */
export interface Ingredient {
    name: string,
    quantity: number,
    unit: string,
    section: number,
    order: number
}
const schema: Record<keyof Ingredient, string> = {
    name: "string",
    quantity: "number",
    unit: "string",
    section: "number",
    order: "number"
};

/**
 * Checks if the given argument is an ingredient.
 * 
 * @param arg Argument to check
 * @returns True if arg is an ingredient, false otherwise
 */
export function isIngredient(arg: any): arg is Ingredient
{
    const missingProperties = Object.keys(schema)
        .filter(key => arg[key] === undefined)
        .map(key => key as keyof Ingredient)
        .map(key => `Ingredient is missing ${ key } ${ schema[key] }.`);

    return missingProperties.length === 0;
}

/**
 * Get all ingredient property names.
 * 
 * @returns Array of ingredient property names
 */
export function getIngredientPropertyNames(): Array<string>
{
    return Object.keys(schema)
        .map(key => key as keyof Ingredient);
}