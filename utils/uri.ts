export function decodeURISpaces(uriComponent: string|undefined): string|undefined
{
    if (uriComponent) {
        uriComponent = uriComponent.replaceAll("%20", " ");
        uriComponent = uriComponent.replaceAll("+", " ");
    }

    return uriComponent;
}