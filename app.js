'use strict';
require('dotenv').config();
const vhost = require('vhost');
const express = require("express");
const mongoose = require("mongoose");
const rateLimit = require('express-rate-limit');
const taskController = require('./controllers/taskController');

async function run() {
    await dbConnect();
    initExpress();
    await startTasks();
}

async function startTasks() {
    console.log(`[*] Starting tasks..`);
    await taskController.clearExpiredLinks();
}

async function dbConnect() {
    console.log(`[*] Connecting to mongoDB..`);
    mongoose.set('debug', true);
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

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50, // Number of requests
        message: {
            "err" : "You've hit the rate limit. Try again later.",
            "msg" : "To lose patience is to lose the battle."
        },
        standardHeaders: true,
        legacyHeaders: false,
    })

    // 2 Proxies (Cloudflare, Heroku). Needed for rate-limiting the correct IP
    app.set('trust proxy', 2)
    app.use(limiter);
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
