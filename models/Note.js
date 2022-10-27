import { Schema, model } from 'mongoose'

const noteSchema = new Schema({
  content: String,
  important: Boolean,
  date: Date
})

/*
Aquí se transforma la respuesta que llega con el objetivo de eliminar el _id y __v.
OJO: No muta nada en la BD, solo muta la respuesta que llega
*/
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

export const Note = model('Note', noteSchema)

// const note = new Note({
//   content: 'MongoDB es increíble',
//   important: true,
//   date: new Date()
// })

// note.save()
//   .then(res => {
//     console.log(res)
//     mongoose.connection.close()
//   }).catch(err => console.error(err))

// Note.find({})
//   .then(res => {
//     console.log(res)
//     mongoose.connection.close()
//   }).catch(err => console.error(err))
