import express, { Application } from 'express';
import path from 'path';
import { CategoryRoute } from '../routes/CategoryRoute';
import { ProductRoute } from '../routes/ProductRoute';
const app = express();

export default async (app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/assets', express.static('assets'));
    app.use('/category', CategoryRoute);
    app.use('/product', ProductRoute);
    app.use('/assets', express.static(path.join(__dirname, '../assets')));

    return app;
};
