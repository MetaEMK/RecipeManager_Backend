export enum GeneralValidationErrorCodes {
    //ID
    ID_MISSING = "The ID is missing",
    ID_INVALID = "The ID is invalid",

    //NAME
    NAME_MISSING = "NAME_MISSING",
    NAME_INVALID = "Name must be a string",
    NAME_INVALID_LENGTH = "INVALID_NAME_LENGTH",


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
    BRANCH_ID_INVALID = "Branch ID is invalid",
    BRANCH_ID_NOT_UNIQUE = "Branch ID is not unique",
}
