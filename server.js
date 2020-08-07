/*jshint esversion: 8 */
const express = require('express')
const session = require('express-session')
const mongoose = require('mongoose')
const articleRouter = require('./routes/articles')
const userRouter = require('./routes/users')
const database = require('./models/article_database')
const methodOverride = require('method-override')
const app = express()

mongoose.connect(
    'your mongodb address',
    {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    })

app.set('view engine', 'ejs')

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(session({
    secret: '6BJF-95BH-HF6JH9',
    resave: true,
    saveUninitialized: true
}))

function checkLogin(req, res, next) {
    try {
        if (!req.session.user_id) {
            res.redirect('/users/login');
        } else {
            next();
        }
    } catch (e) {
        res.redirect('/users/login')
    }
}

app.get('/', checkLogin, async (req, res) => {
    const articles = await database.find().sort({ modifiedAt: 'desc' })
    res.set({ 'Content-Type': 'application/xhtml+xml' })
    res.render('articles/index', { articles: articles })
})

app.get('/logout', (req, res) => {
    delete req.session.user_id
    res.redirect('/users/login')
}) 

app.use('/users', userRouter)

app.use('/articles', articleRouter)

app.listen(5000)
