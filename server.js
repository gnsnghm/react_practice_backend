const express = require('express');
const app = express();
const accountsControler = require('./controllers/accountsController')
require('dotenv').config();

// Setting middleware
const cors = require('cors'); // Cross Origin Resouce Sharing を有効にする
const bodyParser = require('body-parser'); // レスポンスのフォーマットを変換する
const morgan = require('morgan') // HTTPリクエストロガー
const helmet = require('helmet') // Cross-Site-Scripting(XSS)のような攻撃を防ぐ

// knex を使って database に接続する
var db = require('knex')({
  client: 'pg',
  connection: {
    host: 'ae-db',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
  }
});

// Middleware
// const whitelist = ['http://localhost:3001'];
// const whitelist = ['http://localhost:3000', 'http://localhost:3001'];
const whitelist = process.env.WHITELIST_PORT.split(' ').map((_, i) => 'http://localhost:' + _);
const corsOption = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}
app.use(helmet());
app.use(cors(corsOption));
app.use(bodyParser.json());
app.use(morgan('combined'));

// Router
app.get('/', (req, res) => res.send('Server is running.'));
app.get('/crud', (req, res) => accountsControler.getData(req, res, db));
app.post('/crud', (req, res) => accountsControler.postData(req, res, db, 'accounts'));
app.post('/regist', (req, res) => accountsControler.postUserData(req, res, db, 'users'));
app.put('/crud', (req, res) => accountsControler.putData(req, res, db));
app.delete('/delete', (req, res) => accountsControler.delData(req, res, db));

// TEST
app.get('/test', (req, res) => accountsControler.tester(req, res, db));

// Connect
app.listen(process.env.PORT || 3000, () => {
  console.log(`port ${process.env.PORT} || 3000`)
});


