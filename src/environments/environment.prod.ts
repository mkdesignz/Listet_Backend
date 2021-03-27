import express from 'express';
import session, { SessionOptions } from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors'
import * as vars from './variables';
import MySQLSession from 'express-mysql-session';
import * as expressSession from 'express-session';
const production = express();

/**
 *
 * TODO: Find out why I can't implement
 *       @types/express-mysql-session properly.
 *
 */
const MySQLStore = MySQLSession(expressSession);
const sessionStore = new MySQLStore(vars.DB_CONFIG);

const sess: SessionOptions = {
  name: vars.session.id,
  secret: vars.session.secret,
  resave: true,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: "auto",
    sameSite: true,
    httpOnly: true,
    domain: vars.variables.hostname,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  }
}

production.use(morgan('combined'));
production.use(cors({
  origin: [
    'https://' + vars.app.url,
    'https://' + vars.app.url2,
    'http://' + vars.app.url,
    'http://' + vars.app.url2,
  ],
  credentials: true
}));
production.use(helmet())
production.set('trust proxy', true);
sess.cookie.secure = false;
production.use(session(sess))
production.use(express.static('public'));
export = production;
