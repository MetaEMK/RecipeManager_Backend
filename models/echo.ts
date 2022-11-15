// import {echoStore} from "./db.js";

// export interface EchoInput {
//     message: string;
// }

// export interface Echo extends EchoInput {
//     _id: string;
// }

// export function createEchoLog(echo: EchoInput): Promise<Echo> {
//     return new Promise((resolve, reject) => {
//         echoStore.insert(echo, (err, newDoc: Echo) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(newDoc);
//             }
//         });
//     });
// }

// export function queryEchos(messageContains?: string): Promise<Echo[]> {
//     return new Promise((resolve, reject) => {
//         echoStore.find(messageContains ? {message: new RegExp(messageContains)} : {}, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data || []);
//             }
//         });
//     });
// }
