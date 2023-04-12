import express from 'express'
import bodyparser from 'body-parser'
import cookieparser from 'cookie-parser'
import flash from 'connect-flash'
import session from 'express-session'
import passport from 'passport'
import favicon from 'serve-favicon'
import path from 'path'
import helmet from 'helmet'
import {router} from './server/routers/routers.js'
import authentication from './configurations/authentication.js';
authentication(passport);
import mysqlstore from 'express-mysql-session'
mysqlstore(session)
import compression from 'compression'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 8080;

app.use(compression())
app.use(helmet({contentSecurityPolicy:false}))

// receiving forms data
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// sessions and cookies
const options = {
  host : process.env.HOST,
  user : process.env.USER,
  password : process.env.PASSWORD,
  database : process.env.DATABASE,
  schema: {
    tableName: 'sessions',
    columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
    }
  }
};
const sessionStore = new mysqlstore(options);

app.use(cookieparser());
app.use(
  session({
    secret: 'secretkey',
    saveUninitialized: false,
    resave: false,
    store : sessionStore,
    cookie:{maxAge: 60 * 60 * 1000}
  })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// displaying messages success/errors on redirect
app.use(flash());
app.use((req, res, next) => {
  res.locals.Success = req.flash('Success');
  res.locals.Unavailable = req.flash('Unavailable');
  res.locals.Updated = req.flash('Updated');
  res.locals.Deleted = req.flash('Deleted');
  res.locals.validationerror = req.flash('validationerror');
  res.locals.loginpageMsg = req.flash('loginpageMsg')
  next();
});

// ejs template engine    
app.set('view engine', 'ejs');

// static files
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);


app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`))

