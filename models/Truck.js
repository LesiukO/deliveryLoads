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
    this.userId = userId
    this.errors = []
}

Truck.prototype.cleanUp = function () {
    console.log(this.data)//!!!!!!!!!!!!!!!!!!!!!

    this.data = {
        title: this.data.title.trim(),
        playload: truckParams[this.data.trucktype].playload,
        trucktype: this.data.trucktype,
        dimensions: {
            width: truckParams[this.data.trucktype].width,
            length: truckParams[this.data.trucktype].length,
            height: truckParams[this.data.trucktype].height,
        },
        createdDate: new Date(),
        created_by: ObjectID(this.userId),
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

Truck.findSingleById = function (id) {
    return new Promise( async function (resolve, reject) {
        if (typeof (id) != "string" || !ObjectID.isValid(id)) {
            reject()
            return
        }
        // let load = await loadsCollection.findOne({_id: new ObjectID(id)})
        let trucks = await trucksCollection.aggregate([
            {$match: {_id: new ObjectID(id)}},
            {$lookup: {from: "users", localField: "created_by", foreignField: "_id", as: "authorDocument"}},
            {$project: {
                title: 1,
                trucktype: 1,
                playload: 1,
                dimensions: 1,
                createdDate: 1,
                created_by: {$arrayElemAt: ["$authorDocument", 0]}
            }}
        ]).toArray()


        trucks = trucks.map( truck => {
            truck.created_by = {
                username: truck.created_by.username
            }
            return truck
        })

        if (trucks.length) {
            console.log(trucks[0])
            resolve(trucks[0]) 
        } else {
            reject() 
        }
    })
}

//    Truck.findSingleById = function (id) {
//     return new Promise( async function (resolve, reject) {
//         if (typeof (id) != "string" || !ObjectID.isValid(id)) {
//             reject()
//             return
//         }
//         let truck = await trucksCollection.findOne({_id: new ObjectID(id)})
//         if (truck) {
//             resolve(truck) 
//         } else {
//             reject() 
//         }
//     })
// }
   
   module.exports = Truck