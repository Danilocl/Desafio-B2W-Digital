require('dotenv/config')

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');

class App {
    constructor() {
        this.server = express();

        this.middlewares();
        this.database();
        this.routes();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use(express.json());
    }

    database() {
        mongoose.connect(process.env.MONGO_URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });                
    }

    routes() {
        this.server.use(routes);
    }
}

module.exports = new App().server;