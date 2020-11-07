//------------REQUIRES------------//

require('dotenv').config()
const express = require('express')  // Web Server
const app = express()
const morgan = require('morgan')    // Middleware to print requests to console
const cors = require('cors')    // Allows requests
const Person = require('./models/person')    // DB


//------------INITIALIZES MIDDLEWARE------------//

app.use(express.json())     // Allows express to use json
app.use(express.static('build'))    // Serves static build of react app

//  Morgan definition to choose how requests are printed.
app.use(morgan(function (tokens, req, res) {
    if(tokens.method(req, res) != 'POST'){
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms'
        ].join(' ')
    }else{
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens.content(req, res)
        ].join(' ')
    }
}))

//  Morgan token that returns body of request.
morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(cors()) // Adding cors to app


//------------ENDPOINTS------------//

//  Just a default page for whatever.
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

//  Returns information about phonebook.
app.get('/info', (request, response) => {
    const num = persons.length
    const date = new Date();
    response.send(
            `<p>Phonebook has info for ${num} people.</p>
            <p>${date}</p>
            `
        )
})

//  ENDPOINT: Gets all persons in phonebok.
app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
})

//  ENDPOINT: Gets person at specific id.
app.get('/api/persons/:id', (request, response) => { 
    const id = Number(request.params.id)
    
    Person.findById(id)
        .then(person => {
            response.json(person)
        })
        .catch(err => {
            response.json(err.message)
        })
})

//  ENDPOINT: Adds person to phonebook.
app.post('/api/persons', (request, response) => {
    const body = request.body

    //  If the request has no 
    if(!body.name){
        return response.status(400).json({error: "Name Missing."})
    }

    //  Create person object based off request against dbschema.
    const person = new Person({
        name: body.name,
        number: body.number
    })

    //  Save Person to database.
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

//  ENDPOINT: Deletes person with id.
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server starting on port ${PORT}`)