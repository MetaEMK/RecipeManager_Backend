/**
 * Decodes URI characters %20 and + to a space character.
 * 
 * @param uriComponent URI component to decode
 * @returns Decoded URI component
 */
export function decodeURISpaces(uriComponent: string|undefined): string|undefined
{
    if (uriComponent) {
        uriComponent = uriComponent.replaceAll("%20", " ");
        uriComponent = uriComponent.replaceAll("+", " ");
    }

    return uriComponent;
}

/**
 * Generates a slug for the given name.
 * Removes replaces spaces and german umlauts.
 * 
 * @param name Name which should be turned into a slug 
 * @returns A slug conform string
 */
export function generateSlug(name: string): string
{
    return name
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll("\u00fc", "ue")
        .replaceAll("\u00e4", "ae")
        .replaceAll("\u00f6", "oe")
        .replaceAll("\u00df", "ss");
}