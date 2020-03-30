const loadsCollection = require('../db').db().collection("loads")
const ObjectID = require('mongodb').ObjectID

let Load = function (data, userId) {
    this.data = data
    this.created_by = userId
    this.errors = []
}

Load.prototype.cleanUp = function () {
    console.log(this.data)//!!!!!!!!!!!!!!!!!!!!!

    this.data = {
        title: this.data.title.trim(),
        dimensions: {
            width: parseFloat(this.data.width),
            length: parseFloat(this.data.length),
            height: parseFloat(this.data.height),
        },
        weight: parseFloat(this.data.weight),
        createdDate: new Date(),
        created_by: ObjectID(this.created_by),
    }
    console.log(this.data)
}

Load.prototype.validate = function () {
    if (this.data.title == "") {this.errors.push("You must provide a title.")}
    if (this.data.weight == "") {this.errors.push("You must provide a weight.")}
    if (this.data.width == "") {this.errors.push("You must provide a width.")}
    if (this.data.length == "") {this.errors.push("You must provide a length.")}
    if (this.data.height == "") {this.errors.push("You must provide a height.")}

    if (Number.isNaN(this.data.dimensions.height)) {this.errors.push("Invalid value of height.")}
    if (Number.isNaN(this.data.dimensions.width)) {this.errors.push("Invalid value of width.")}
    if (Number.isNaN(this.data.dimensions.length)) {this.errors.push("Invalid value of length.")}
    if (Number.isNaN(this.data.weight)) {this.errors.push("Invalid value of weight.")}
}

Load.prototype.create = function () {
 return new Promise( (resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
        loadsCollection.insertOne(this.data).then(function () {
            resolve()
        }).catch(function () {
            this.errors.push("Please try again later.")
            reject(this.errors)
        })
    } else {
        reject(this.errors)        
    }
 })
}

module.exports = Load