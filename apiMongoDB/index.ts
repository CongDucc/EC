import express from 'express'
import App from "./service/Expressapp"
import DbCon from "./service/database"
import { PORT } from './config'

const StartServer = async () => {
    const app = express();
    await DbCon();
    await App(app);

    app.listen(PORT, () => {
        console.log(`Connected on ${PORT}!!! DONE :-)`)
    })
}

StartServer();
