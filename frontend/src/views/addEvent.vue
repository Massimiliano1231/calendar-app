<template>
  <div class="event-form">
    <h2>Crea un Nuovo Evento</h2>
    <form @submit.prevent="createEvent">
      <div>
        <label for="title">Titolo:</label>
        <input type="text" v-model="newEvent.title" required="true" />
      </div>
      <div>
        <label for="description">Descrizione:</label>
        <textarea v-model="newEvent.description" required="true"></textarea>
      </div>
      <div>
        <label for="date">Data:</label>
        <input type="date" v-model="newEvent.date" required="true" />
      </div>
      <div>
        <label for="startTime">Ora di Inizio:</label>
        <input type="time" v-model="newEvent.startTime" required="true" />
      </div>
      <div>
        <label for="duration">Durata (minuti):</label>
        <input type="number" v-model="newEvent.duration" required="true" />
      </div>
      <div>
        <label for="location">Luogo:</label>
        <input type="text" v-model="newEvent.location" required="true"/>
      </div>
      <div>
        <label>È Ripetibile?</label>
        <input type="checkbox" v-model="newEvent.isRecurring" />
      </div>
      <div v-if="newEvent.isRecurring">
        <label for="frequency">Frequenza:</label>
        <select v-model="newEvent.frequency">
          <option value="daily">Giornaliero</option>
          <option value="weekly">Settimanale</option>
          <option value="monthly">Mensile</option>
        </select>
        <div> 
          <label for="numberOfOccurrences">Numero di Ripetizioni:</label>
          <input type="number" v-model="newEvent.numberOfOccurrences"  />
        </div>
      </div>
      <div>
        <label>Meccanismo di Notifica:</label>
        <div>
          <input type="checkbox" value="email" v-model="newEvent.notificationMechanism" /> Email
          <input type="checkbox" value="alert" v-model="newEvent.notificationMechanism" /> Alert
          <input type="checkbox" value="no" v-model="newEvent.notificationMechanism" />nessuna notifica
        </div>
        <div>
          <label for="notificationTime">Tempo di Notifica (minuti prima):</label>
          <input type="number" v-model="newEvent.notificationTime" />
        </div>
        <div>
          <label for="repeatNotification">Quante volte ripetere la notifica:</label>
          <input type="number" v-model="newEvent.repeatNotification" />
        </div>
      </div>

      <div class="form-group">
        <label for="type">Tipo di Evento:</label>
        <select v-model="newEvent.type" id="type" class="form-input">
          <option value="singola">Singola</option>
          <option value="gruppo">Gruppo</option>
        </select>
      </div>
      
      <div v-if="newEvent.type === 'gruppo'">
        <label>Partecipanti:</label>
        <div v-for="user in users" :key="user.username" class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            :value="user.username" 
            :id="user.username" 
            v-model="newEvent.participants" 
            v-if="user.username !== loggedInUsername"  
          />
          <label class="form-check-label" :for="user.username">
            {{ user.username }} 
          </label>
        </div>
      </div>

      <button type="submit">Crea Evento</button>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

export default {
 
  
  setup() {
    const route = useRoute();
    const message = ref(''); 
    const router = useRouter();
    const email = localStorage.getItem('email');
    const loggedInUsername = localStorage.getItem('username') || 'Guest'; 
    const newEvent = ref({
      title: '',
      description: '',
      date: '',
      startTime: '',
      duration: '',
      location: '',
      isRecurring: false,
      frequency: 'one-time',
      email: email,
      numberOfOccurrences: null,
      notificationMechanism: [],
      notificationTime: 0,
      repeatNotification: 0,
      author: loggedInUsername,
      participants: [loggedInUsername] , 
      type: 'singola',
      altri: false,
    });

    onMounted(() => {
      if (route.query.date) {
        newEvent.value.date = route.query.date;
      }
      fetchUsers(); 
    });

    const selectedParticipants = ref([]);
    const users = ref([]);
    
    const createEvent = async () => {

      const currentDate = new Date();
  const eventDate = new Date(newEvent.value.date);

  currentDate.setHours(0, 0, 0, 0);

  if (eventDate < currentDate) {
      alert("Data non valida"); 
    return; 
  }
      try {
        const token = sessionStorage.getItem('token');
        const author = newEvent.value.author;
        const participants = newEvent.value.participants.filter(participant => participant !== author);
        
       
  
        for (const participant of participants) {
    const unavailableTimes = await fetchUnavailableTimes(participant);

    for (const time of unavailableTimes) {
        const unavailableDate = new Date(time.giorno);
        const formattedDate = unavailableDate.toISOString().split('T')[0];





        const unavailableStart = new Date(unavailableDate);
        unavailableStart.setHours(time.startHour, time.startMinute, 0, 0);


        const unavailableEnd = new Date(unavailableDate);
        unavailableEnd.setHours(time.endHour, time.endMinute, 0, 0);


        const startHour = unavailableStart.getHours();
        const startMinute = unavailableStart.getMinutes();
        const endHour = unavailableEnd.getHours();
        const endMinute = unavailableEnd.getMinutes();

        


        const eventDate = new Date(newEvent.value.date);
        const eventStartTime = newEvent.value.startTime;
        const [eventStartHour, eventStartMinute] = eventStartTime.split(':').map(Number);
        const eventStartInMinutes = eventStartHour * 60 + eventStartMinute; 


        if (time.repeatDaily) {

            const unavailableStartInMinutes = startHour * 60 + startMinute;
            const unavailableEndInMinutes = endHour * 60 + endMinute;

            if (eventStartInMinutes >= unavailableStartInMinutes && eventStartInMinutes <= unavailableEndInMinutes) {
                alert(`L'orario dell'evento ${eventStartTime} è compreso nell'intervallo di indisponibilità ${startHour}:${startMinute} - ${endHour}:${endMinute} per l'utente: ${participant}`);
                return;
            }

        } else {
            const formattedEventDate = eventDate.toISOString().split('T')[0];

            if (formattedEventDate === formattedDate) {
                const unavailableStartInMinutes = startHour * 60 + startMinute;
                const unavailableEndInMinutes = endHour * 60 + endMinute;

                if (eventStartInMinutes >= unavailableStartInMinutes && eventStartInMinutes <= unavailableEndInMinutes) {
                    alert(`L'orario dell'evento ${eventStartTime} è compreso nell'intervallo di indisponibilità ${startHour}:${startMinute} - ${endHour}:${endMinute} per l'utente: ${participant}`);
                    
                    return;
                }
                 else {
                  console.log("orario non c'è");
                 }
            }
               else {
                console.log("giorno non c'è");
               }
        }




          }
        }

        

     
    
  

        const response = await axios.post('/api/events', newEvent.value, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        
        
        newEvent.value = {
          title: '',
          description: '',
          date: '',
          startTime: '',
          duration: '',
          location: '',
          isRecurring: false,
          frequency: 'one-time',
          email: '',
          numberOfOccurrences: null,
          notificationMechanism: [],
          notificationTime: 0,
          repeatNotification: 0,
          author: localStorage.getItem('username') || 'Guest',
          participants: [], 
          type:'singola',
          altri: false,
        };

        console.log('Evento creato con successo:', response.data);
        message.value = 'Evento creato con successo!';
        
        setTimeout(() => {
          message.value = '';
          router.push('/homePrincipale');
        }, 3000);
      } catch (error) {
        message.value = 'Errore durante la creazione dell\'evento: ' + error.message;
        console.error('Errore:', error);
      }
    };

   const fetchUnavailableTimes = async (username) => {

    const token = sessionStorage.getItem('token');
    try {
        const response = await axios.get('/api/nonDisponibileGET', {
            headers: {
                Authorization: `Bearer ${token}` 
            },
            params: { username: username },
        });
        return response.data;
    } catch (error) {
        console.log("Errore recupero non disponibile user", error);
        return[];
    }
};

    



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

    return {
      newEvent,
      selectedParticipants,
      users,
      message,
      createEvent,
      loggedInUsername
    };
  },

};
</script>

<style scoped>
.event-form {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background-color: #15172b;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); 
  transition: transform 0.3s ease; 
  box-sizing: border-box;
}

.event-form:hover {
  transform: translateY(-5px); 
}

.event-form h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
}

.event-form div {
  margin-bottom: 20px;
}

.event-form label {
  font-weight: bold;
  margin-bottom: 8px;
  color: #acb0b4;
  font-family: 'Poppins', sans-serif;
  display: block;
}

.event-form input[type="text"],
.event-form input[type="date"],
.event-form input[type="time"],
.event-form input[type="number"],
.event-form textarea,
.event-form select {
  padding: 12px;
  border: 2px solid #ced4da;
  border-radius: 8px;
  font-size: 16px;
  width: 100%;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.event-form input:focus,
.event-form textarea:focus,
.event-form select:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.25); 
  outline: none;
}

.event-form textarea {
  height: 120px;
  resize: none;
}

.event-form button {
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

.event-form button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.event-form p {
  text-align: center;
  margin-top: 20px;
  color: #28a745;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
}

.event-form input,
.event-form textarea,
.event-form button {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
}

.event-form div {
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

.back-home-link {
  color: #0016db;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.3s ease;
  text-align: left;
}
</style>
