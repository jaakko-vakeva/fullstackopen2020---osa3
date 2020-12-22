const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()


morgan.token("person", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json()) 
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :person")
);
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
    number: "12-43-234356"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })

  app.get('/info', (req, res) => {
    res.send(
        `   <div>Phonebook has info for ${persons.length} people</div>
            <br>
            <div>${new Date()}</div>`  
        )
  })


  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })



  const generateId = () => {
    return Math.floor(Math.random() * Math.floor(1000))
  }


  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: "name missing"
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: "number missing"
        })
    } else if (persons.filter(p => p.name === body.name).length > 0) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    

    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    }

    persons = persons.concat(person)
  
    response.json(person)
  })



  
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })