<template>
  <div class="activity-list">
    <h1>Lista delle Attività:</h1>
    <h2>Numero Attività: {{ activities.length }}</h2>
    
    <ul v-if="activities.length > 0" class="activity-items">
      <li v-for="(activity, index) in activities" :key="index" class="activity-item">
        <h3>{{ activity.title }}</h3>
        <p>{{ activity.description }}</p>
        <p><strong>Scadenza:</strong> {{ formatDate(activity.deadline) }}</p>
        <p><strong>Autore:</strong> {{ activity.author }}</p>
        <p><strong>Completata:</strong> {{ activity.completed ? 'Sì' : 'No' }}</p>

        <p v-if="activity.participants && activity.participants.length > 0">
  <strong>Attività di Gruppo Creata da:</strong> {{ activity.author }} 
  <br>
  <strong>Gruppo Composto da:</strong> {{ formatGroup(activity.participants) }}
</p>


        <button @click="confirmDelete(activity._id)" class="delete-btn">🗑️</button>
      </li>
    </ul>
    
    <p v-else class="no-activities">Non ci sono attività da visualizzare.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      activities: []
    };
  },
  methods: {
    confirmDelete(id) {
      if (confirm("Sicuro di voler eliminare questa Attività?")) {
        this.deleteActivities(id); 
      }
    },
    
    async deleteActivities(id) {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username') ;
        await axios.delete(`/api/activitiesRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params:{username: username} 
        });
        console.log('Attività eliminata');
        this.fetchActivities(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione della attività:', error);
      }
    },
    
    async fetchActivities() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username'); 
        const response = await axios.get('/api/activitiesGET', {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { username: username }
        });
        const currentDate = new Date();
        this.activities = response.data.filter(activity => 
          new Date(activity.deadline) >= currentDate
        );
      } catch (error) {
        console.error('Errore durante il recupero delle attività:', error);
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },

    formatGroup(group) {
      return group.join(', '); 
    }
  },
  mounted() {
    this.fetchActivities();
  }
};
</script>

<style scoped>
.activity-list {
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

.activity-items {
  list-style-type: none;
  padding: 0;
}

.activity-item {
  padding: 15px;
  margin-bottom: 10px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 4px;
  transition: box-shadow 0.3s;
  position: relative;
}

.activity-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

.no-activities {
  text-align: center;
  color: #6c757d;
}
</style>
