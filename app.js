'use strict';
const vhost = require('vhost');
const express = require('express');
const dbConnect = require('./models/database').connect;
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const NODE_ENV = process.env.NODE_ENV || 'development';
const DEPLOY_STAGE = process.env.DEPLOY_STAGE || 'development';

async function run() {
  console.log(`[!] NODE_ENV: ${NODE_ENV}`);
  console.log(`[!] DEPLOY_STAGE: ${DEPLOY_STAGE}`);
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

  app.use(express.json());
  app.use(handleJsonErrors());
  app.set('view engine', 'ejs');
  app.use(cors({ origin: '*' }));

  if (NODE_ENV === 'production' && DEPLOY_STAGE === 'production') {
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 50, // Number of requests
      message: { errors: [{ msg: 'To lose patience is to lose the battle.' }] },
      standardHeaders: true,
      legacyHeaders: false,
    });
    // 2 Proxies (Cloudflare, Heroku). Needed for rate-limiting the correct IP
    app.set('trust proxy', 2);
    app.use(limiter);
    app.use(vhost('nin.sh', expandApp));
    app.use(vhost('shrink.ninja', shrinkApp));
  } else if (NODE_ENV === 'development' && DEPLOY_STAGE === 'staging') {
    app.use(vhost('dev.nin.sh', expandApp));
    app.use(vhost('dev.shrink.ninja', shrinkApp));
  } else if (NODE_ENV === 'development' && DEPLOY_STAGE === 'development') {
    app.use(vhost('local.nin.sh', expandApp));
    app.use(vhost('local.shrink.ninja', shrinkApp));
    const fs = require('fs');
    const https = require('https');
    const options = {
      key: fs.readFileSync('./secrets/key.pem'),
      cert: fs.readFileSync('./secrets/cert.pem'),
    };
    https.createServer(options, app).listen(443, () => {
      console.log(`[*] HTTPS Listening on 443`);
    });
  }

  app.listen(process.env.PORT || 3000, () => {
    console.log(`[*] HTTP Listening on ${process.env.PORT || 3000}`);
  });
}

function handleJsonErrors() {
  return (error, req, res, next) => {
    if (error instanceof SyntaxError) {
      return res.status(500).send({ errors: [{ msg: 'Invalid JSON' }] });
    } else {
      next();
    }
  };
}

run();
