require('dotenv').config({ path:'var.env' })
const express=require('express')
const app=express()
app.use(express.json())
var morgan = require('morgan')
const cors=require('cors')


app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('request-body', function (request, response) {return JSON.stringify(request.body)} )
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :request-body'))

const Contact=require('./modules/mongo')
let persons=
[
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
app.get('/api/persons',(request,response) => {
    Contact.find({}).then(contactt => {
      response.json(contactt)
    })
})
app.get('/info', (request,response) => {

    const size=persons.length
    const date=new Date()
    date.getDate()
    response.send(`<p>the number of persons is ${size} </p>
    ${date}`)
    })

app.get('/api/persons/:id',(request,response) => {
  const personToResponse= persons.find(person => person.id==Number(request.params.id))
  if(personToResponse){
    response.json(personToResponse)
  }
  else{
    response.statusMessage='there is no person with this id'
    response.status(404).end()
  }

})
app.post('/api/persons',(request,response,next) => {
  const body=request.body
  console.log(request.body)

  if(!body.name || !body.number)
  {
    return response.status(400).json({ error: 'content missing' })
  }
  else
  if(persons.find(person => person.name===body.name || person.number===body.number ))
  {
    return response.status(400).json({ error: 'content identical ' })
  }
  const person= new Contact({
    number:body.number,
    name:body.name
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => {
    console.log(error)
    next(error)
  })


})
app.delete('/api/persons/:id',(request, response, next) => {
    Contact.findByIdAndDelete(request.params.id).then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  //console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  //next(error)
}

app.use(errorHandler)
const PORT=process.env.PORT
app.listen(PORT,() => {
    console.log("listening to port:"+PORT)
})



