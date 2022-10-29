import * as dotenv from 'dotenv'
// Como los módulos se cachean, al importar './mongo', ejecutamos la conexión a la BD
import './mongo.js'
import express, { json } from 'express'
import cors from 'cors'
import { Note } from './models/Note.js'
import { notFound } from './middleware/notFound.js'
import { handleErrors } from './middleware/handleErrors.js'
dotenv.config()

const app = express()
app.use(cors())
// Esto es necesario para la petición POST
app.use(json())

app.get('/', (req, res) => {
  res.send('<h1>Hello world! My API is working</h1>')
})

// Obtener todas las notas
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (error) {
    console.error(error)
  }
  // .then(notes => {
  //   res.json(notes)
  // }).catch(err => console.error(err))
})

// Obtener una nota
app.get('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    const note = await Note.findById(id)
    console.log(note)
    if (note) {
      return res.json(note)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// Eliminar una nota
app.delete('/api/notes/:id', async (req, res, next) => {
  const { id } = req.params
  try {
    await Note.findByIdAndRemove(id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Crear una nota
app.post('/api/notes', async (req, res, next) => {
  const newNote = req.body
  if (!newNote || !newNote.content) {
    return res.status(400).json({
      error: 'No content was supplied'
    })
  }

  try {
    const note = new Note({
      ...newNote,
      date: new Date(),
      important: newNote.important ?? false
    })
    res.status(201).json(await note.save())
  } catch (error) {
    next(error)
  }
})

// Actualizar una nota
app.put('/api/notes', async (req, res, next) => {
  let noteToEdit = req.body

  noteToEdit = {
    ...noteToEdit,
    date: new Date()
  }

  try {
    const updatedNote = await Note.findByIdAndUpdate(noteToEdit.id, { ...noteToEdit }, { new: true })
    res.json(updatedNote).end()
  } catch (error) {
    next(error)
  }
})

// Middleware
app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
