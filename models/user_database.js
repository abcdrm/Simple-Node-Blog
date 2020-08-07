/*jshint esversion: 8 */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    useremail: { 
        type: String, unique: true, 
        required: true 
    },
    password: { type: String, 
        required: true 
    }
})

userSchema.pre('save', function (next) {
    const self = this
    if (!self.isModified('password')) {
        return next()
    }

    bcrypt.genSalt(5, function (err, salt) {
        if (err) return next(err)

        bcrypt.hash(self.password, salt, function (err, hash) {
            if (err) return next(err)
            self.password = hash
            next()
        })
    })
})

module.exports = mongoose.model('User', userSchema)