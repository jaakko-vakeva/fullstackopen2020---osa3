const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://jaakko:${password}@cluster1.js72j.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: "Mary Poppendick",
    number: "39-23-6423122"
})


if (process.argv.length==3) {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}
else {
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
}

// console.log(process.argv)

// ADD <person> TO DATABASE
/*
person.save().then(response => {
  console.log('person saved!')
  mongoose.connection.close()
})
*/


// LIST ALL PEOPLE
/*
Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
*/