var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const fs = require('fs');
const getChampDetail = require('./request');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

/**
   * CORS & Preflight request
   */
const { CORS_ALLOW_ORIGIN } = process.env
app.use((req, res, next) => {
    if (req.path !== '/' && !req.path.includes('.')) {
        res.set({
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Origin':
                CORS_ALLOW_ORIGIN || req.headers.origin || '*',
            'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
            'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
            'Content-Type': 'application/json; charset=utf-8',
        })
    }
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})

/**
  * binding route
  */
const handlerPath = path.join(__dirname, 'handler');
const files = fs.readdirSync(handlerPath)
const handlers = files.reverse().filter(f => f.endsWith('.js'))
    .map(file => {
        const identifier = file.split('.').shift()
        const route = `/${file.replace(/\.js$/i, '').replace(/_/g, '/').replace('@', ':')}`
        const modulePath = path.join(handlerPath, file)
        const handle = require(modulePath)

        return { identifier, route, handle }
    })

for (const handler of handlers) {
    app.use(handler.route, async (req, res) => {
        try {
            const championDetail = await getChampDetail(req.params.id)
            if (championDetail == null)
                throw new Error('无法获取英雄信息')

            res.send({
                code: 200,
                msg: 'succ',
                data: handler.handle(championDetail, { ...req.params, ...req.query })
            })
        }
        catch (e) {
            console.error(e)
            res.send({ code: 500, msg: e.message })
        }
    })
}

module.exports = app;
