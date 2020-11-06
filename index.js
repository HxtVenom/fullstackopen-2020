const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))

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

morgan.token('content', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(cors())

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Marry Poppendick",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    const num = persons.length
    const date = new Date();
    response.send(
            `<p>Phonebook has info for ${num} people.</p>
            <p>${date}</p>
            `
        )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => { 
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({error: "Name Missing."})
    }else if(persons.filter(p => p.name === body.name).length > 0){
        return response.status(400).json({error: "Name must be unique."})
    }

    const id = Math.random() * 10000;

    const person = {
        id: id,
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server starting on port ${PORT}`)