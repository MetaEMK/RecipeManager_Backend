import { checkBranchValidator } from "./branch.validator.js";
import { checkCategoryalidator } from "./category.validator.js";
import { RecipeValidator } from "./recipe.validator.js";
import { checkSizeValidator } from "./size.validator.js";

console.clear()

let val: RecipeValidator = new RecipeValidator();
let obj = [
    {"id": 1},
    {"id": 2},
]
val.isValidBranchIds(obj)
let errors = val.getErrors();
errors.forEach((error) => {
    console.log(error.toString());
});