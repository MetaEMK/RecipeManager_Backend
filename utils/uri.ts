export function decodeURISpaces(uriComponent: string): string
{
    uriComponent = decodeURIComponent(uriComponent);
    uriComponent = uriComponent.replaceAll("+", " ");

    return uriComponent;
}