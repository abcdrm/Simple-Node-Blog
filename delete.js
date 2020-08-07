const mongoose = require('mongoose')
const userDatabase = require('./models/user_database')

// mongoose.connect(
//     'mongodb+srv://abcdrm:13243546@cluster0-spvu2.mongodb.net/test?retryWrites=true&w=majority',
//     {
//         useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
//     })

// userDatabase.deleteMany({}, (err, result) => {
//     if (err) {
//         console.log(err)
//     }
//     if (result) {
//         console.log(result)
//     }
// })

console.log(Date.now())
