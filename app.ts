// import express from 'express';
// import path from 'path';
// import {apiRouter} from "./api.js";
// import dotenv from 'dotenv';

// dotenv.config({ path: './config/app.env'});

// const app = express();

// app.use('/api', apiRouter);

// app.use(express.static(process.env.FRONTEND_DIST_PATH!));
// app.use((req, res) => {
//     res.sendFile(path.join(__dirname, process.env.FRONTEND_DIST_PATH!, 'index.html'))
// });

// app.listen(process.env.NODE_PORT, () => {
//     console.log(`App listening at http://localhost:${process.env.NODE_PORT}`)
// });
