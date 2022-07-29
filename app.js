'use strict';
require('dotenv').config();
const vhost = require('vhost');
const express = require("express");
const dbConnect = require('./models/database').connect;
const rateLimit = require('express-rate-limit');

async function run() {
    await dbConnect();
    initExpress();
}

function initExpress() {
    const shrinkApp = express();
    const expandApp = express();
    const app = express();
    const expandRoutes = require('./routes/ninRoutes');
    const shrinkRoutes = require('./routes/shrinkRoutes');

    shrinkApp.use('/', shrinkRoutes);
    expandApp.use('/', expandRoutes);

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 50,                  // Number of requests
        message: {
            errors: [{"msg" : "To lose patience is to lose the battle."}],
        },
        standardHeaders: true,
        legacyHeaders: false,
    });

    // 2 Proxies (Cloudflare, Heroku). Needed for rate-limiting the correct IP
    app.set('trust proxy', 2);
    app.use(limiter);

    app.use(express.json());

    app.use(vhost('nin.sh', expandApp));
    app.use(vhost('shrink.ninja', shrinkApp));

    app.use((error, req, res, next) => {
        if (error instanceof SyntaxError) {
            return res.status(500).send({errors: [{"msg": "Invalid JSON"}]});
        } else {
            next();
        }
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`[*] Listening on ${process.env.PORT || 3000}`);
    });
}

run();
