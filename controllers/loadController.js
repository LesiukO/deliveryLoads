const Load = require('../models/Load')

exports.viewCreateScreen = function (req, res) {
    res.render('create-load')
}

exports.create = function (req, res) {
    let load = new Load(req.body, req.session.user._id)
    load.create().then(function () {
        res.send('created')
    }).catch(function (errors) {
        res.send(errors)
    })
}