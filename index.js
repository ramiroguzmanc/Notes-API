// Como los módulos se cachean, al importar './mongo', ejecutamos la conexión a la BD
import './mongo.js'
import express, { json } from 'express'
import cors from 'cors'
import { Note } from './models/Note.js'

const app = express()
app.use(cors())
// Esto es necesario para la petición POST
app.use(json())

let notes = [{}]

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
app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id === id)

  note ? res.json(note) : res.status(404).end()
})

// Eliminar una nota
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.json(notes)
})

// Crear una nota
app.post('/api/notes', (req, res) => {
  let newNote = req.body

  if (!newNote || !newNote.content) {
    return res.status(400).json({
      error: 'No content was supplied'
    })
  }

  const notesID = notes.map((note) => note.id)
  const maxNotesID = Math.max(...notesID)

  newNote = {
    id: maxNotesID + 1,
    ...newNote,
    date: new Date(),
    important: newNote.important ?? false
  }
  notes = notes.concat(newNote)
  res.status(201).json(newNote)
})

// Actualizar una nota
app.put('/api/notes', (req, res) => {
  let noteToEdit = req.body

  notes = notes.map(note => {
    if (note.id === noteToEdit.id) {
      noteToEdit = {
        ...note,
        ...noteToEdit,
        date: new Date()
      }
      return noteToEdit
    }
    return note
  })

  res.json(noteToEdit)
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
