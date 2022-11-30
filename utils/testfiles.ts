import * as file from "./files.js";

console.log(await file.deleteAllContentInDirectoryAsync("DirectoryThatDoesNotExist"));
console.log(await file.deleteAllContentInDirectoryAsync("DirectoryToDelete"));