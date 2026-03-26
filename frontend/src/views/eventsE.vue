<template>
  <div class="event-list">
    <h1>Lista Eventi</h1>
    <h2>Numero Eventi: {{ events.length }}</h2>
    <ul>
      <li v-for="event in events" :key="event._id" class="event-item">
        <h2>{{ event.title }}</h2>
        <p>{{ event.description }}</p>
        <p><strong>Data:</strong> {{ formatDate(event.date) }}</p>
        <p><strong>Orario:</strong> {{ event.time }}</p>
        <p><strong>Durata:</strong> {{ event.duration }} minuti</p>
        <p><strong>Luogo:</strong> {{ event.location }}</p>
        <p><strong>Ripetizione:</strong> {{ formatRepeat(event) }}</p>
        <p><strong>Autore:</strong> {{ event.author }}</p>
        <button @click="confirmDelete(event._id)" class="delete-btn">🗑️</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      currentDate: new Date() 
    };
  },
  methods: {
    confirmDelete(id) {
      if (confirm("Sicuro di voler eliminare questo Evento?")) {
        this.deleteEvents(id); 
      }
    },
    
    async deleteEvents(id) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/eventsRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Evento eliminato');
        this.fetchEvents(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione di evento:', error);
      }
    },

    async fetchEvents() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/eventsGET', {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { author: username }
        });
        
       this.events = response.data;
      } catch (error) {
        console.error('Errore nel recupero degli eventi:', error);
      }
    },
    
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString();
    },

    formatRepeat(event) {
      if (event.repeatFrequency) {
        let frequencyDetails = `${event.repeatFrequency}`;
        if (event.daysOfWeek && event.daysOfWeek.length) {
          frequencyDetails += ` ogni ${event.daysOfWeek.join(', ')}`;
        }
        if (event.dayOfMonth) {
          frequencyDetails += ` ogni ${event.dayOfMonth}° giorno del mese`;
        }
        if (event.repeatUntil) {
          frequencyDetails += ` fino al ${this.formatDate(event.repeatUntil)}`;
        }
        return frequencyDetails;
      }
      return 'Nessuna ripetizione';
    }
  },
  mounted() {
    this.fetchEvents();

     
  },

  
};
</script>

<style scoped>
.event-list {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #343a40;
}

ul {
  list-style-type: none;
  padding: 0;
}

.event-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  padding-right: 40px; 
  position: relative; 
}

.event-item h2 {
  color: #007bff;
  margin: 0;
}

.event-item p {
  margin: 5px 0;
}

.delete-btn {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.delete-btn:hover {
  color: red;
}
</style>