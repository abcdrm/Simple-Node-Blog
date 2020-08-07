/*jshint esversion: 8 */
const express = require('express')
const database = require('../models/article_database')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json(({ limit: "50mb" }));
const router = express.Router()

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

router.get('/new', checkLogin, (req, res) => {
    res.render('articles/new')
})

router.get('/:id', checkLogin, async (req, res) => {
    try {
        const article = await database.findById(req.params.id)
        res.render('articles/show', { article: article })
    } catch (error) {
        res.redirect('/')
    }
})

router.post('/new', [checkLogin, jsonParser], async (req, res) => {
    let article = new database({
        title: req.body.title,
        preview: req.body.preview,
        content: req.body.content
    })

    try {
        article = await article.save()
        res.send(article.id)
    } catch (e) {
        res.send('Error occurs at saving.')
    }
})

router.post('/:id', [checkLogin, jsonParser], async (req, res) => {
    let article = new database({
        title: req.body.title,
        preview: req.body.preview,
        content: req.body.content
    })

    try {
        await database.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                title: req.body.title,
                preview: req.body.preview,
                content: req.body.content,
                modifiedAt: Date.now()
            })
        res.send(article.id)
    } catch (e) {
        res.send('Error occurs at saving.')
    }
})

router.delete('/:id', checkLogin, async (req, res) => {
    try {
        await database.findByIdAndDelete(req.params.id)
        res.redirect('/')
    } catch (e) {
        res.redirect('/articles/' + req.params.id)
    }
})

module.exports = router