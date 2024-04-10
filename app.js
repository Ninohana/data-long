var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const fs = require('fs');

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
const providerPath = path.join(__dirname, 'out', 'data-source', 'provider')
const providerFiles = fs.readdirSync(providerPath)
const providerList = providerFiles.filter(f => f.endsWith('.js')).map(f => require(path.join(providerPath, f)).default)

const handlerPath = path.join(__dirname, 'handler');
const files = fs.readdirSync(handlerPath)
const handlers = files.reverse().filter(f => f.endsWith('.js'))
    .map(file => {
        const identifier = file.split('.').shift()
        let providers = []
        const route = `/${file.replace(/\[([a-z]+)\]/, (m, p1, o, s) => {
            providers = providerList.filter(p => p.support(p1))
            return ''
        })
            .replace(/\.js$/i, '')
            .replace(/_/g, '/')
            .replace(/@/g, ':')}`
        const modulePath = path.join(handlerPath, file)
        const handle = require(modulePath)

        return { identifier, route, providers, handle }
    })
console.log(handlers)

for (const handler of handlers) {
    app.use(handler.route, async (req, res) => {
        try {
            res.send({
                code: 200,
                msg: 'succ',
                data: await handler.handle(handler.providers, { ...req.params, ...req.query })
            })
        }
        catch (e) {
            console.error(e)
            res.send({ code: 500, msg: e.message })
        }
    })
}

module.exports = app;
