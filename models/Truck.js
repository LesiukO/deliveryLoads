const trucksCollection = require('../db').db().collection("trucks")
const ObjectID = require('mongodb').ObjectID

let truckParams = {
    sprinter: {
        playload: 1700,
        width: 300,
        length: 250,
        height: 170,
    },
    small: {
        playload: 2500,
        width: 500,
        length: 350,
        height: 170,
    },
    large: {
        playload: 4000,
        width: 300,
        length: 350,
        height: 200,
    },
}

let Truck = function (data, userId) {
    this.data = data
    this.created_by = userId
    this.errors = []
}

Truck.prototype.cleanUp = function () {
    console.log(this.data)//!!!!!!!!!!!!!!!!!!!!!

    this.data = {
        title: this.data.title.trim(),
        playload: truckParams[this.data.trucktype].playload,
        dimensions: {
            width: truckParams[this.data.trucktype].width,
            length: truckParams[this.data.trucktype].length,
            height: truckParams[this.data.trucktype].height,
        },
        createdDate: new Date(),
        created_by: ObjectID(this.created_by),
    }
    console.log(this.data)//!!!!!!!!!!!!!!!!!!
}

Truck.prototype.validate = function () {
    if (this.data.title == "") {this.errors.push("You must provide a title.")}
}

Truck.prototype.create = function () {
    return new Promise( (resolve, reject) => {
       this.cleanUp()
       this.validate()
       if (!this.errors.length) {
           trucksCollection.insertOne(this.data).then(function () {
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
   
   module.exports = Truck