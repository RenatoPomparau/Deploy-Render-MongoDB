require('dotenv').config({path:'var.env'})
const mongoose = require('mongoose')

// if (process.argv.length<3) {
//   console.log('give password as argument')
//   process.exit(1)
// }


const url =process.env.url

mongoose.set('strictQuery',false)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 5, 
    required: true
  },
  number: String,
})
phonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Contact', phonebookSchema)

