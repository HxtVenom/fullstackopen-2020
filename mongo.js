const mongoose = require('mongoose');

if(process.argv.length < 3){ 
    console.log("Please enter a password: node mongo.js <password>")
    process.exit(0)
}

const password = process.argv[2]

const url = 
    `mongodb+srv://fullstack:${password}@fullstack.v04cp.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose
    .connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .catch(err => {
        console.log(err.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})

const Person = mongoose.model('Person', personSchema)

const genID = () => {
    return Math.floor(Math.random() * 100000)
}

if(process.argv.length > 4){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        id: genID()
    })

    person
        .save()
        .then(result => {
            console.log(`Added ${result.name} number ${result.number} to phonebook.`)
            mongoose.connection.close()
        })
        .catch(err => {
            console.log(err.message)
        })
}else{
    console.log("Phonebook:")
    
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person.name, person.number)
            })
            mongoose.connection.close()
        })
        .catch(err => {
            console.log(err.message)
        })
}