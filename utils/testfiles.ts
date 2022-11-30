import * as file from "./files.js";

let test = await file.getAllFilesAsync("test");
if(!test) console.log("Error");
else
for (let index = 0; index < test.length; index++) {
    console.log(file.getFileInfo("test/" + test[index]));
    
}
