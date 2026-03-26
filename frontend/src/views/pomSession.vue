<template>
  <div class="pomodoro-list">
    <h1>Lista delle Sessioni Pomodoro Salvate</h1>

    <h2>Numero Pomodori : {{poms.length}}</h2>

    <ul v-if="poms.length > 0">
      <li v-for="pom in poms" :key="pom._id" class="pomodoro-item">
        <h2>Sessione Pomodoro</h2>
        <p><strong>Username:</strong> {{ pom.username }}</p>
        <p><strong>Tempo di Studio:</strong> {{ pom.tempoStudio }} minuti</p>
        <p><strong>Tempo di Pausa:</strong> {{ pom.tempoPausa }} minuti</p>
        <p><strong>Ripetizioni:</strong> {{ pom.ripetizioni }}</p>
        <p><strong>Data della Sessione:</strong> {{ formatDate(pom.giorno) }}</p>
        <button @click="confirmDelete(pom._id)" class="delete-btn">🗑️</button>
      </li>
    </ul>
    <p v-else class="no-poms">Non ci sono sessioni Pomodoro da visualizzare.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      poms: []
    };
  },
  methods: {
    confirmDelete(id) {
      if (confirm("Sicuro di voler eliminare questa sessione Pomodoro?")) {
        this.deletePomodoro(id); 
      }
    },
    
    async deletePomodoro(id) {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/pomRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        this.fetchPoms(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione della sessione:', error);
      }
    },

    async fetchPoms() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/poms', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.poms = response.data.filter(pom => {
          const sessionDate = new Date(pom.giorno);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate >= today;
        });

        console.log('Sessioni Pomodoro recuperate e filtrate:', this.poms);
      } catch (error) {
        console.error('Errore durante il recupero delle sessioni Pomodoro:', error);
      }
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    }
  }, 
  mounted() {
    this.fetchPoms();
  }
};
</script>


<style scoped>
.pomodoro-list {
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

.pomodoro-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  position: relative;
  padding-right: 40px; 
}

.pomodoro-item h2 {
  color: #007bff;
  margin: 0;
}

.pomodoro-item p {
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

.no-poms {
  text-align: center;
  color: #6c757d;
}
</style>
