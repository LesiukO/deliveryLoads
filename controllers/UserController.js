const User = require('../models/User')

exports.login = function (req, res) {
     let user = new User(req.body)
     user.login().then(function (result) {
         req.session.user = {
             username: user.data.username,
             role: user.data.role
            }
        req.session.save(function() {
            res.redirect('/')
        })
     }).catch(function(e) {
        req.flash('errors', e)
        req.session.save(function() {
            res.redirect('/')
        })
     }) 
}

exports.logout = function (req, res) {
    req.session.destroy(function () {
        res.redirect('/')
    })
}

exports.register = function (req, res) {
    let user = new User(req.body)
    user.register()
    if (user.errors.length) {
        res.send(user.errors)
    } else {
        res.send('congrats, there are no errors')
    }
}

exports.home = function (req, res) {
    // res.render("home-guest")
    if (req.session.user) {
        res.render('home-dashboard', {username: req.session.user.username, role: req.session.user.role})
    } else {
        res.render("home-guest", {errors: req.flash('errors')})
    }

}

