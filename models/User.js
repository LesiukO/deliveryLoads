const usersCollection = require('../db').db().collection("users")
const validator = require('validator')

let User = function (data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function () {
    if (typeof(this.data.username) != "string") {this.data.username = ""}
    if (typeof(this.data.email) != "string") {this.data.email = ""}
    if (typeof(this.data.password) != "string") {this.data.password = ""}
    // if (typeof(this.data.role) != "string ") {this.data.role = ""}

    this.data = {
        username: this.data.username.trim().toLowerCase(),
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password,
        role: this.data.role,
    }
}

User.prototype.validate = function () {
    return new Promise(async (resolve, reject) => {
        if (this.data.username == "") {this.errors.push("You must provide a username.")}
        if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {this.errors.push("Username can only contain letters and numbers.")}
        if (!validator.isEmail(this.data.email)) {this.errors.push("You must provide a valid email address.")}
        if (this.data.password == "") {this.errors.push("You must provide a password.")}
        if (this.data.password.length > 0 && this.data.password.length < 12) {this.errors.push("Password must be at least 12 characters.")}
        if (this.data.password.length > 100) {this.errors.push("Password cannot exceed 100 characters.")}
        if (this.data.username.length > 0 && this.data.username.length < 3) {this.errors.push("Username must be at least 3 characters.")}
        if (this.data.username.length > 30) {this.errors.push("Username cannot exceed 30 characters.")}
    
        // if username is valid check if it is already taken
        if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
            let usernameExists = await usersCollection.findOne({username: this.data.username})
            if (usernameExists) {
                this.errors.push("That username is already taken.")
            }
        }
    
        // if email is valid check if it is already taken
        if (validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({email: this.data.email})
            if (emailExists) {
                this.errors.push("That email is already being used.")
            }
        }
        resolve()
    })
}

User.prototype.login = function () {
    return new Promise( (resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({username: this.data.username}).then((attemptedUser) => {
            if (attemptedUser && attemptedUser.password == this.data.password) {
                resolve('Congrats')
            } else {
                reject("Invalid username or password")
            }
        }).catch(function () {
            reject("Please try againg later.")
        }) 
    })
}

User.prototype.register = function () {
    return new Promise( async (resolve, reject ) => {
        // 1) Validate User data
        this.cleanUp()
        await this.validate()
    
        // 2) if ok save to database
        if (!this.errors.length) {
            await usersCollection.insertOne(this.data)
            resolve()
        } else {
            reject(this.errors)
        }
    })
} 

module.exports = User