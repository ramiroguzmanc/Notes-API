// import http from 'http'
// const http = require("http");
import express, { json } from 'express'
import cors from 'cors'
const app = express()

app.use(cors())
// Esto es necesario para la petición POST
app.use(json())

let notes = [
  {
    id: 1,
    content: 'Me tengo que suscribir a @midudev en YouTube',
    date: '2019-05-30T17:30:31.098Z',
    important: true
  },
  {
    id: 2,
    content: 'Tengo que estudiar las clases del FullStack Bootcamp',
    date: '2019-05-30T18:39:34.091Z',
    important: false
  },
  {
    id: 3,
    content: 'Repasar los retos de JS de midudev',
    date: '2019-05-30T19:20:14.298Z',
    important: true
  }
]

// const app = http.createServer((request, response) => {
//   response.writeHead(200, { "content-type": "application/json" });
//   response.end(JSON.stringify({ name: "Rama", lastName: "Guzmán" }));
// });

app.get('/', (req, res) => {
  res.send('<h1>Hello world! My API is working</h1>')
})

// Obtener todas las notas
app.get('/api/notes', (req, res) => {
  res.json(notes)
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
