<template>
  <div class="activity-form">
    <h1>Aggiungi una nuova attività</h1>

    <form @submit.prevent="submitActivity" class="form-container">
      <div class="form-group">
        <label for="title">Titolo:</label>
        <input v-model="newActivity.title" id="title" required class="form-input">
      </div>

      <div class="form-group">
        <label for="description">Descrizione:</label>
        <textarea v-model="newActivity.description" id="description" class="form-textarea" required="true"></textarea>
      </div>

      <div class="form-group">
        <label for="deadline">Scadenza:</label>
        <input v-model="newActivity.deadline" type="date" id="deadline" required class="form-input">
      </div>

      <div class="form-group">
        <label for="type">Tipo di Attività:</label>
        <select v-model="newActivity.type" id="type" class="form-input">
          <option value="singola">Singola</option>
          <option value="gruppo">Gruppo</option>
        </select>
      </div>

      <div v-if="newActivity.type === 'gruppo'" class="form-group">
        <label>Partecipanti:</label>
        <div v-for="user in users" :key="user.username" class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :value="user.username" 
            :id="user.username" 
            v-model="newActivity.participants" 
            v-if="user.username !== loggedInUsername"  
          />
          <label class="form-check-label" :for="user.username">
            {{ user.username }} 
          </label>
        </div>
      </div>

      <button type="submit" class="submit-button">Aggiungi Attività</button>
    </form>

    <p v-if="message" class="status-message">{{ message }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const loggedInUsername = localStorage.getItem('username') || 'Guest'; 

    const newActivity = ref({
      title: '',
      description: '',
      deadline: '',
      author: loggedInUsername,
      email: localStorage.getItem('email') || '',
      completed: false,
      type: 'singola',
      participants: [loggedInUsername] 
    });

    const users = ref([]); 
    const message = ref('');

    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        users.value = response.data; 
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
      }
    };

    onMounted(async () => {
      await fetchUsers();

      if (route.query.date) {
        newActivity.value.deadline = route.query.date;
      }
    });

    const submitActivity = async () => {

      const currentDate = new Date();
  const activityDate = new Date(newActivity.value.deadline);

  currentDate.setHours(0, 0, 0, 0);

  if (activityDate < currentDate) {
      alert("Data non valida"); 
    return; 
  }

      try {
        const token = sessionStorage.getItem('token');
        await axios.post('/api/activities', newActivity.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        newActivity.value = {
          title: '',
          description: '',
          deadline: '',
          author: loggedInUsername,
          email: localStorage.getItem('email') || '',
          completed: false,
          type: 'singola',
          participants: [loggedInUsername] 
        };

        message.value = 'Attività aggiunta con successo!';
        setTimeout(() => {
          message.value = '';
          router.push('/homePrincipale');
        }, 2000);
      } catch (error) {
        message.value = 'Errore: ' + error.message;
        console.error('Errore:', error);
      }
    };

    return {
      newActivity,
      users,
      message,
      submitActivity,
      loggedInUsername
    };
  }
};
</script>




<style scoped>
.activity-form {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #15172b;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.activity-form:hover {
  transform: translateY(-5px);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
}

.form-container {
  display: flex;
  flex-direction: column;
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

.status-message {
  text-align: center;
  margin-top: 20px;
  color: #28a745;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

.form-input, .form-textarea, .submit-button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
