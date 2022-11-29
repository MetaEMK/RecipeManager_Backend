import { DataSource } from "typeorm";

// Database settings
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./data/ReMa.db",
    logging: true,
    synchronize: true,
    entities: [
        "entities/*.js"
    ]
});