const dotenv = require('dotenv')
dotenv.config()
const mongodb = require('mongodb')

// userPassword: FgvLu23A
mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, client) {
    module.exports = client.db()
    const app = require('./app')
    app.listen(process.env.PORT )
})