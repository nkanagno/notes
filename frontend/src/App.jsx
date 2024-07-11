import { useState, useEffect } from 'react'
import Note from './components/Note.jsx'
import noteService from './services/notes.js'
import Notification from './components/Notification.jsx'
import Footer from './components/Footer.jsx'
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote,setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage,setErrorMessage] = useState(null)

    useEffect(() => {
      console.log('effect')
      noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])
  console.log('render', notes.length, 'notes')

  const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })

    .catch(error => {
      setErrorMessage(
        `Note '${note.content}' was already removed from the server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  const addNote = (event) => {
  event.preventDefault()
  if(newNote === "") return;
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
    id: (notes.length + 1).toString(),
  }
  noteService
      .create(noteObject)
      .then(returnedNote  => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }
  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)




  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>

      <ul>
        {notesToShow.map(note => 
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App 
