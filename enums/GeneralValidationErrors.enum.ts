export enum GeneralValidationErrorCodes {
    //ID
    ID_MISSING = "The ID is missing",
    ID_INVALID = "The ID is invalid",

    //NAME
    NAME_MISSING = "NAME_MISSING",
    NAME_INVALID = "Name must be a string",
    NAME_INVALID_LENGTH = "INVALID_NAME_LENGTH",

    //QUANTITY
    QUANTITY_MISSING = "Quantity is missing",
    QUANTITY_INVALID = "Quantity is invalid",

    //MULTIPLICATOR
    MULTIPLICATOR_MISSING = "Multiplicator is missing",
    MULTIPLICATOR_INVALID = "Multiplicator is invalid",

    //DESCRIPTION
    DESCRIPTION_MISSING = "Description is missing",
    DESCRIPTION_INVALID = "Description must be a string",

    //CONVERSION TYPE ID
    CONVERSION_TYPE_ID_MISSING = "Conversion Type ID is missing",
    CONVERSION_TYPE_ID_INVALID = "Conversion Type ID is invalid",

    CATEGORY_IDS_MISSING = "Category_id array is missing",
    CATEGORY_IDS_INVALID = "Category_id array is invalid",
    CATEGORY_ID_INVALID = "Category ID is invalid",
    CATEGORY_ID_NOT_UNIQUE = "Category ID is not unique",

    //BRANCH ID
    BRANCH_IDS_MISSING = "Branch_id array is missing",
    BRANCH_IDS_INVALID = "Branch_id array is invalid",
    BRANCH_ID_MISSING = "Branch ID is missing",
    BRANCH_ID_INVALID = "Branch ID is invalid",
    BRANCH_ID_NOT_UNIQUE = "Branch ID is not unique",

    //DAY
    DAY_MISSING = "Day is missing",
    DAY_INVALID = "Day is invalid, Valid Numbers: 1-7",

    //VARIANT ID
    VARIANT_ID_MISSING = "Variant ID is missing",
    VARIANT_ID_INVALID = "Variant ID is invalid",
}
