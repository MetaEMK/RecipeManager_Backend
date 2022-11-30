import * as file from "./files.js";

let test = await file.getAllFilesAsync("test", "img");
if(!test) console.log("Error");
else
for (let index = 0; index < test.length; index++) {
    console.log(test[index]);
    
}
console.log("\n\n\n");
let tes2t = await file.getAllFilesAsync("test", "txt");
if(!tes2t) console.log("Error");
else for (let index = 0; index < tes2t.length; index++) {
    console.log(tes2t[index]);
    
}
