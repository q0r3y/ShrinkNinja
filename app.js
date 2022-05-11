'use strict';
require('dotenv').config();
const vhost = require('vhost');
const express = require("express");
const mongoose = require("mongoose");

async function run() {
    await dbConnect();
    initExpress();
}

async function dbConnect() {
    console.log(`[*] Connecting to mongoDB..`);
    //mongoose.set('debug', true);
    await mongoose.connect(
        process.env.MONGO_DB_CONNECTION,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            console.log(`[+] Database Connected.`);
        })
        .catch((err) => {
            console.log(`[-] Unable to connect to database.`);
            console.log(err);
        });
}

function initExpress() {
    const shrinkApp = express();
    const expandApp = express();
    const app = express();
    const expandRoutes = require('./routes/expand');
    const shrinkRoutes = require('./routes/shrink');

    shrinkApp.use('/', shrinkRoutes);
    expandApp.use('/', expandRoutes);

    app.use(express.json());

    app.use(vhost('nin.sh', expandApp));
    app.use(vhost('shrink.ninja', shrinkApp));

    app.use((error, req, res, next) => {
        if (error instanceof SyntaxError) {
            return res.status(500).send({error: "Invalid JSON"});
        } else {
            next();
        }
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`[*] Listening on ${process.env.PORT || 3000}`);
    });
}

run();
