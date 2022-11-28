import sqlite3, { Database } from 'sqlite3';
import { open } from 'sqlite';


class dataBase {
    db: any;
    
    async connect() {
        if(this.db == undefined) {
            this.db = await open<sqlite3.Database, sqlite3.Statement>({
                filename: './ReMa.db',
                driver: sqlite3.Database
            });
            await this.db.exec('PRAGMA foreign_keys = ON');
            console.log("Connected to database");
        }
    } 

    async get(query: string, params: any[]) {
        await this.connect();

        let stmt = await this.db.prepare(query);
        await stmt.bind(params);

        const test = await stmt.all();
        return test;
    }
}
let test = new dataBase();
let t = test.get("SELECT * FROM test WHERE id = ? OR id = ?", [1 , 2]);
console.log (t) ;