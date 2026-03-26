<template>
  <div class="note-container">
    <h1>Aggiungi una Nota</h1>
    <form @submit.prevent="addNote" class="note-form">
      <div class="form-group">
        <label for="heading">Titolo:</label>
        <input type="text" v-model="newNote.heading" id="heading" required="true" class="form-input" />
      </div>
      <div class="form-group">
        <label for="content">Contenuto(possibile scrivere in markdwon):</label>
        <textarea v-model="newNote.content" id="content" rows="4" class="form-textarea" required="true"></textarea>
      </div>

      <div class="form-group">
        <label for="access">Livello di Accesso:</label>
        <select v-model="newNote.access" id="access" class="form-input">
          <option value="public">Pubblico</option>
          <option value="private">Privato</option>
          <option value="restricted">Riservato</option>
        </select>
      </div>

      <div class="form-group" v-if="newNote.access === 'restricted'">
        <label>Utenti Autorizzati:</label>
        <div v-for="user in filteredUsers" :key="user._id" class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :value="user.username" 
            :id="user._id" 
            v-model="newNote.allowedUsers" 
          />
          <label class="form-check-label" :for="user._id">
            {{ user.username }} 
          </label>
        </div>
      </div>

      <button type="submit" class="submit-button">Aggiungi Nota</button>
    </form>

    <h1>Note</h1>
    <ul class="notes-list">
      <li v-for="note in notes" :key="note._id" class="note-item">
        <h2>{{ note.heading }}</h2>
        <div class="note-content" v-html="renderMarkdown(note.content)"></div>
        <p>Autore: {{ note.author }}</p>
        <p v-if="(note.access === 'public' || (note.access === 'restricted' && note.allowedUsers && note.allowedUsers.includes(username))) && note.author !== username">
           Condivisa con te da: {{ note.author }}
        </p>

        <div class="note-actions">
          <button @click="editNote(note._id)" class="edit-btn">Modifica</button>
          <button @click="deleteNote(note._id)" class="delete-btn">Elimina</button>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
import axios from 'axios';
import { marked } from 'marked';

export default {
  data() {
    return {
      newNote: {
        heading: '',
        access: 'private',
        allowedUsers: [],
        content: ''
      },
      allUsers: [],
      notes: [],
      username: '' 
    };
  },

  computed: {
    filteredUsers() {
      return this.allUsers.filter(user => user.username !== this.username); 
    }
  },

  async created() {

    this.username = localStorage.getItem('username'); 

    await this.fetchNotes();
    await this.fetchUsers(); 
  },
  
  methods: {
    async fetchNotes() {
      try {
        const token = sessionStorage.getItem('token');
        if (!this.username) {
          console.error('Username non trovato');
          return;
        }
        const response = await axios.get('/api/notesGET', {
          params: { username: this.username },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.notes = response.data;
      } catch (error) {
        console.error('Errore nel recupero delle note:', error);
      }
    },
    
    async addNote() {
      try {
        const token = sessionStorage.getItem('token');
        if (!this.username) {
          console.error('Username non trovato, impossibile creare la nota');
          return;
        }
        this.newNote.author = this.username;

        const response = await axios.post('/api/notes', this.newNote, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Nota aggiunta:', response.data);

        this.newNote = { heading: '', content: '', access: 'private', allowedUsers: [] };
        this.fetchNotes();
      } catch (error) {
        console.error("Errore nell'aggiunta della nota:", error);
      }
    },

    editNote(id) {
      this.$router.push(`/edit-note/${id}`);
    },

    async deleteNote(id) {
  try {
    const token = sessionStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    await axios.delete(`/api/notesRIM/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        username: username 
      }
    });

    this.fetchNotes();
  } catch (error) {
    if (error.response && error.response.status === 403) {
      alert('Non autorizzato a eliminare la nota');
    } else {
      console.error("Errore nell'eliminazione della nota:", error);
    }
  }
},


    async fetchUsers() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.allUsers = response.data;
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
      }
    },

    renderMarkdown(content) {
      if (!content) return '';
      return marked(content);
    }
  }
};

</script>

<style scoped>
.note-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #15172b;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.note-container:hover {
  transform: translateY(-5px);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  display: block;
}

.form-input, .form-textarea {
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  background-color: #f3f4f6;
}

.form-input:focus, .form-textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25);
  outline: none;
}

.form-textarea {
  height: 120px;
  resize: none;
}

.submit-button {
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  transition: background-color 0.3s ease, transform 0.2s;
}

.submit-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.notes-list {
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.note-item {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.note-content {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #333;
  width: 100%;
  text-align: left;
}

.note-actions {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.note-actions button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin: 0 5px;
  transition: background-color 0.3s;
}

.note-actions .edit-btn:hover {
  background-color: #0056b3;
}

.note-actions .delete-btn {
  background-color: #dc3545;
}

.note-actions .delete-btn:hover {
  background-color: #c82333;
}

.status-message {
  text-align: center;
  margin-top: 20px;
  color: #28a745;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}
</style>
