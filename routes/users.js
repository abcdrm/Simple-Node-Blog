/*jshint esversion: 8 */
const express = require('express')
const bcrypt = require('bcrypt');
const userDatabase = require('../models/user_database')
const articleDatabase = require('../models/article_database')
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json(({ limit: "50mb" }))
const router = express.Router()

router.get('/login', (req, res) => {
    message = {}
    message.err = false
    res.set({ 'Content-Type': 'application/xhtml+xml' })
    res.render('register/login', { message })
})

router.post('/login', jsonParser, async (req, res) => {
    email = req.body.userEmail
    password = req.body.userPassword

    try {
        message = {}
        message.err = true
        const user = await userDatabase.find({ useremail: email })
        if (user.length != 0) {
            bcrypt.compare(password, user[0].password, async (err, isMatch) => {
                if (err || !isMatch) {
                    res.render('register/login', { message })
                    return
                }
                const articles = await articleDatabase.find().sort({ modifiedAt: 'desc' })
                articles.login = true
                req.session.user_id = req.body.userEmail
                res.redirect('/')
            })
        } else {
            res.render('register/login', { message })
        }
    } catch (e) {
        res.send('database error')
    }
})

router.get('/register', (req, res) => {
    message = {}
    message.err = false
    message.content = ''
    res.set({ 'Content-Type': 'application/xhtml+xml' })
    res.render('register/signup', { message })
})

router.post('/register', async  (req, res) => {
    message = {}
    if (req.body.userPassword.length < 8) {
        message.err = true
        message.content = 'Too short password!'
        res.render('register/signup', { message })
    } else {
        let user = new userDatabase({
            useremail: req.body.userEmail,
            password: req.body.userPassword
        })
        
        try {
            id = await user.save()
            res.redirect('/users/login')
        } catch (e) {
            message.err = true
            message.content = 'Email exist!'
            res.render('register/signup', { message } )
        }
    }
})

module.exports = router