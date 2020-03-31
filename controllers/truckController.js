const Truck = require('../models/Truck')

exports.viewCreateScreen = function (req, res) {
    res.render('create-truck')
}
 
exports.create = function (req, res) {
    let truck = new Truck(req.body, req.session.user._id)
    truck.create().then(function () {
        res.send('truck created')
    }).catch(function (errors) {
        res.send(errors)
    })
}

exports.viewSingle = async function (req, res) {
    try {
        let truck = await Truck.findSingleById(req.params.id)
        res.render('single-truck-screen', {truck: truck})
    } catch {
        res.render('404')
    }
}