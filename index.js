require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

const Person = require('./models/person')


morgan.token('person', (request, _result) => {
  return JSON.stringify(request.body)
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(express.static('build'))
app.use(cors())

app.use(express.json())


/*
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234356'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  },
]
*/

app.get('/', (_req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (_req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/info', (_req, res) => {
  Person.find().count(function(_err, count){
    res.send(
      `   <div>Phonebook has info for ${count} people</div>
            <br>
            <div>${new Date()}</div>`
    )
  })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/api/persons', (_req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


/*
const generateId = () => {
  return Math.floor(Math.random() * Math.floor(1000))
}
*/


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {

  const newPerson = {
    name: request.body.name,
    number: request.body.number,
    id: request.body.id,
  }

  Person.findByIdAndUpdate(request.params.id, newPerson, { new: true } )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, _request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json( { error: error.message })
  }

  next(error)
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)







const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})