import Datastore from 'nedb';

export const echoStore = new Datastore({filename: './databases/echo.db', autoload: true});
