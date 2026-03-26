<template>
   <div>
    <h2 class="main-title">Eventi, Attività e Pomodori per {{ formatDate(queryDate) }}</h2>
     <div class="section events-section full-width">
      <h3>EVENTI DI QUESTO GIORNO:</h3>
      <div v-if="events.length > 0">
        <div v-for="event in events" :key="event._id" class="item-container">
  <h4><span style="font-size: 0.9em;">Titolo:</span> {{ event.title }}</h4>
  <p>Data: {{ formatDate(event.date) }}</p>
  <p>Descrizione: {{ event.description }}</p>
  <p>Ora di inizio: {{ event.startTime }}</p>
  <p>Luogo: {{ event.location }}</p>
  <p>Durata: {{ event.duration }} minuti</p>
  <p v-if="event.type === 'gruppo'" style="color: #FF6347;">
    Evento di gruppo creato da: {{ event.author }} <br>
    gruppo composto da: {{ event.participants.join(', ') }}
  </p>

  <button v-if="event.author === currentUser" @click="confirmDeleteEvent(event._id)" class="delete-btn-cq" >🗑️ Elimina Evento</button>

  

  <button v-if="event.participants.includes(currentUser) && event.author !== currentUser" 
          @click="rejectEvent(event._id)" 
          class="delete-btn-cq">🗑️ Rifiuta Evento</button>

          <button @click="exportToIcal(event)" class="export-btn">📅 Esporta</button>
</div>
      </div>
      <p v-else>Nessun evento per questa data.</p>
      <div class="button-container">
        <button class="fixed-button" @click="navigateToAddEvent" style="background:#f4a460;">
          Aggiungi evento
        </button>
      </div>
    </div>

    <div class="content-container">
      <div class="section activities-section">
        <h3>ATTIVITÀ CHE SCADONO QUESTO GIORNO:</h3>
        <div v-if="activities.length > 0">
          <div v-for="activity in activities" :key="activity._id" class="item-container"
          :class="{ completed: activity.completed }">
            <h4><span style="font-size: 0.9em;">Titolo:</span> {{ activity.title }}</h4>
            <p>Data: {{ formatDate(activity.deadline || activity.date) }}</p>
            <p>Descrizione: {{ activity.description }}</p>
            <p v-if="activity.type === 'gruppo'" style="color: #FF6347;">
              Attività di gruppo creata da: {{ activity.author }}<br>
              Gruppo composto da: {{ activity.participants.join(', ') }}
            </p>
            <button v-if="!activity.completed" @click="markAsCompleted(activity)" class="complete-btn" style="background:#f4a460;">Completata</button>
            <button @click="confirmDeleteActivity(activity._id)" class="delete-btn-cq" >🗑️</button>
          </div>
        </div>
        <p v-else>Nessuna attività per questa data.</p>
        <div class="button-container">
          <button class="fixed-button" @click="navigateToAddActivity" style="background:#f4a460;">
            Aggiungi attivita
          </button>
        </div>
      </div>
      
      
      <div class="content-container">
       <div class="section activities-section">
        <h3>ATTIVITÀ INCOMPLETE:</h3>
        <div v-if="filteredOverdueActivities.length > 0">
          <div v-for="activity in filteredOverdueActivities" :key="activity._id" class="item-container">
            <h4>Titolo: {{ activity.title }}</h4>
            <p>Data scadenza: {{ formatDate(activity.deadline) }}</p>
            <p>Descrizione: {{ activity.description }}</p>
            <div>
              <div>
  <button @click="discardActivity(activity._id)" class="delete-btn discard-btn">Scarta</button>
  <button v-if="!activity.completed" @click="markAsCompleted(activity)" class="delete-btn completed-btn">Completata</button>
</div>

           </div>

          </div>
        </div>
        <p v-else>Nessuna attività incompleta trovata.</p>
      </div>
    </div>
  </div>

    
    <div class="content-container">
  <div class="section activities-section">
    <h3>POMODORI PER QUESTO GIORNO:</h3>
    <div v-if="pomodoros.length > 0">
      <div v-for="pomodoro in pomodoros" :key="pomodoro._id" class="item-container">
        <h4>Pomodoro Sessione</h4>
        <p>Data: {{ formatDate(pomodoro.giorno) }}</p>
        <p>Tempo di studio: {{ pomodoro.tempoStudio }} minuti</p>
        <p>Tempo di pausa: {{ pomodoro.tempoPausa }} minuti</p>
        <p>Ripetizioni: {{ pomodoro.ripetizioni }}</p>
        <button @click="confirmDeletePomodoro(pomodoro._id)" class="delete-btn-cq">🗑️</button>
        <button
          v-if="isSameDay(queryDate, timeMachine) && !pomodoro.isStarted"
          @click="iniziaPomodoro(pomodoro._id, pomodoro.remainingTime, pomodoro.giorno, pomodoro.tempoStudio, pomodoro.tempoPausa, pomodoro.ripetizioni)"
        >
          Inizia il pomodoro
        </button>
        <p v-else-if="pomodoro.isStarted">Pomodoro già avviato</p>
      </div>
    </div>
    <p v-else>Nessun pomodoro per questa data.</p>
    <div class="button-container">
      <button class="fixed-button" @click="navigateToAddPomodoro" style="background:#f4a460;">
        Aggiungi pomodoro
      </button>
    </div>
  </div>


<div class="section activities-section">
  <h3>POMODORI INCOMPLETI E NON AVVIATI</h3>
  <div v-if="combinedPomodoros.length > 0">
    <div v-for="pomodoro in combinedPomodoros" :key="pomodoro._id" class="item-container">
      <h4 v-if="pomodoro.isIncomplete">Pomodoro Incompleto</h4>
      <h4 v-else>Pomodoro Non Avviato</h4>
      <p>Data: {{ formatDate(pomodoro.giorno) }}</p>
      <p v-if="pomodoro.isIncomplete">Tempo rimanente: {{ Math.floor(pomodoro.remainingTime / 60) }}:{{ pomodoro.remainingTime % 60 }}</p>
      <p v-else>Tempo di studio: {{ pomodoro.tempoStudio }} minuti</p>
      <p>Tempo di pausa: {{ pomodoro.tempoPausa }} minuti</p>
      <p>Ripetizioni: {{ pomodoro.ripetizioni }}</p>
      <button v-if="pomodoro.isIncomplete" @click="resumePomodoro(pomodoro)" class="action-button" style="background:#f4a460;">
        Riprendi Sessione
      </button>
      <button v-else @click="iniziaPomodoro(pomodoro._id, pomodoro.remainingTime, pomodoro.giorno, pomodoro.tempoStudio, pomodoro.tempoPausa, pomodoro.ripetizioni)"
              class="action-button" style="background:#f4a460;">
        Inizia Sessione
      </button>
      <button @click="discardPomodoro(pomodoro)" class="delete-btn-cq">🗑️</button>
    </div>
  </div>
  <p v-else>Nessun pomodoro incompleto o non avviato trovato.</p>
</div>

</div>

  
  </div> 

</template>


<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { createEvent } from 'ics';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const events = ref([]);
    const activities = ref([]);
    const pomodoros = ref([]); 
    const incompleteSessions = ref([]);
    const overdueActivities = ref([]); 
    const currentUser = localStorage.getItem('username') ;
    const queryDate = computed(() => route.query.date);
    const timeMachine = ref();
    const unstartedSessions = ref([]);


    const confirmDeleteActivity = (id) => {
      if (confirm("Sicuro di voler eliminare questa Attività?")) {
        deleteActivities(id); 
      }
    };
    const navigateToAddActivity = () => {
      router.push({ path: '/addActivities', query: { date: queryDate.value } });
    };
    const navigateToAddEvent = () => {
      router.push({ path: '/addEvent', query: { date: queryDate.value } });
    };
    const navigateToAddPomodoro = () => {
      router.push({ path: '/pomodoroTempo', query: { date: queryDate.value,nonFare: 'false' } });
    };

    const deleteActivities = async (id) => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        await axios.delete(`/api/activitiesRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { username: username } 
        });
        console.log('Attività eliminata');
        fetchActivities(); 
        fetchOverdueActivities();
      } catch (error) {
        console.error('Errore nell\'eliminazione della attività:', error);
      }
    };

    const confirmDeleteEvent = (id) => {
      if (confirm("Sicuro di voler eliminare questo Evento?")) {
        deleteEvents(id); 
      }
    };

    const rejectEvent = (id) => {
      deleteEvents(id);
    }

    const exportToIcal = async (event) => {

      

      const eventDate = new Date(event.date);
      const [hour, minute] = event.startTime.split(':').map(Number); 

      

      const icsEvent = {
        start: [
      eventDate.getFullYear(), 
      eventDate.getMonth() + 1, 
      eventDate.getDate(), 
      hour, 
      minute, 
    ],
      duration: {hours: event.duration},
      title: event.title,
      description: event.description,
      organizer: { name: event.author}, 
      };



      createEvent(icsEvent, (error, value) => {
       if (error) {
      console.error('Errore nella creazione del file iCalendar:', error);
      return;
        }

    const blob = new Blob([value], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title || "evento"}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('Evento esportato con successo!');
  });


    };



    const combinedPomodoros = computed(() => {
  const incomplete = incompleteSessions.value.map(session => ({
    ...session,
    isIncomplete: true 
  }));

  const unstarted = unstartedSessions.value.map(session => ({
    ...session,
    isIncomplete: false 
  }));

  return [...incomplete, ...unstarted];
});


    const deleteEvents = async (id) => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        await axios.delete(`/api/eventsRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          },
          params: { username: username }
        });
        console.log('Evento eliminato');
        fetchEvents(); 
      } catch (error) {
        console.error('Errore nell\'eliminazione di evento:', error);
      }
    };

    const confirmDeletePomodoro = (id) => {
      if (confirm("Sicuro di voler eliminare questa sessione Pomodoro?")) {
        deletePomodoro(id); 
      }
    };

    const deletePomodoro = async (id) => {
      try {
        const token = sessionStorage.getItem('token');
        await axios.delete(`/api/pomRemove/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        console.log('Sessione Pomodoro eliminata');
        window.location.reload();
      } catch (error) {
        console.error('Errore nell\'eliminazione della sessione:', error);
      }
    };

    const iniziaPomodoro = async (id, remainingTime, date, tempoStudio, tempoPausa, ripetizioni) => {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.post(`/api/iniziaPomodoro/${id}`, {
      date },
      {
      headers: {
         Authorization: `Bearer ${token}` 
        }
    });

    if (response.data.success) {
      router.push({
        path: '/pomodoroTempo',
        query: {
          date: date,
          remainingTime: remainingTime,
          isStudyPhase: true,
          tempoStudio: tempoStudio,
          tempoPausa: tempoPausa,
          ripetizioni: ripetizioni,
          nuovo: true,
          nonFare: true
        }
      });
    } else {
         console.log("errore");
    }
  } catch (error) {
    console.error('Errore durante l\'avvio del pomodoro:', error);
  }
};



    const isSameDay = (date1, date2) => {
      const d1 = new Date(date1);
        const d2 = new Date(date2);
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );

    };


    const fetchActivities = async () => {
  try {
    const token = sessionStorage.getItem('token');
    const author = localStorage.getItem('username'); 
    const response = await axios.get('/api/activities/by-date', {
      headers: { Authorization: `Bearer ${token}` },
      params: { date: queryDate.value, author }, 
    });
    activities.value = response.data;
  } catch (error) {
    console.error('Errore nel recupero delle attività:', error);
  }
};



    const fetchEvents = async () => {
      try {
        const author = route.query.author;
        const date = route.query.date;
        const username = route.query.username || author;

        const token = sessionStorage.getItem('token');

        const response = await axios.get('/api/events/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { author, date }
        });
        events.value = Array.isArray(response.data) ? response.data : [response.data];


        const pomodoroResponse = await axios.get('/api/poms/by-date', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username, date }
        });
        pomodoros.value = Array.isArray(pomodoroResponse.data) ? pomodoroResponse.data : [pomodoroResponse.data];

      } catch (error) {
        console.error('Errore nel recupero degli eventi, delle attività e dei pomodori:', error);
      }
    };

const fetchIncompleteSessions = async () => {
  const token = sessionStorage.getItem('token');
  const username = localStorage.getItem('username');
  const queryDateMs = queryDate.value ? new Date(queryDate.value).valueOf() : null;

  try {
    const response = await axios.get('/api/poms/incomplete', {
      headers: { Authorization: `Bearer ${token}` },
      params: { username }
    });

    const incompleteData = (Array.isArray(response.data) ? response.data : [response.data]).filter(session => {
      return (
        session.studyCycles > 0 &&
        session.remainingTime > 0 &&
        session.tempoStudio &&
        session.tempoPausa &&
        new Date(session.giorno).valueOf() <= queryDateMs
      );
    });

    const nonCompletedResponse = await axios.get('/api/poms/getPomNonPart', {
      headers: { Authorization: `Bearer ${token}` },
      params: { username }
    });

    const nonCompletedData = Array.isArray(nonCompletedResponse.data) ? nonCompletedResponse.data : [];

    incompleteSessions.value = [...incompleteData, ...nonCompletedData];
  } catch (error) {
    console.error('Errore nel recupero delle sessioni:', error);
  }
};


const pomNonAvviati = async () => {
    try {
        const token = sessionStorage.getItem('token'); 
        const username = localStorage.getItem('username'); 

        if (!username) {
            console.error('Username non trovato nel localStorage.');
            return [];
        }

        const response = await axios.get(`/api/sessioniNonPartiteq`, {
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
            params: { username }, 
        });

        const data = response.data;
        console.log("risposta pom non avviati", data);

        if (data.message) {
                    console.log(data.message); 
                    unstartedSessions.value = []; 
                } else {
                    unstartedSessions.value = data; 
                }
            } catch (error) {
                console.error('Errore:', error.response?.data || error.message);
                unstartedSessions.value = [];
            }
};




    const resumePomodoro = (session) => {
    const plainSession = JSON.parse(JSON.stringify(session));

    const nuovo = false;

    router.push({
      path: '/pomodoroTempo',
      query: {
        date: new Date(plainSession.giorno).toISOString(),
        remainingTime: plainSession.remainingTime,
        studyCycles: plainSession.studyCycles,
        isStudyPhase: plainSession.isStudyPhase,
        tempoStudio: plainSession.tempoStudio, 
        tempoPausa: plainSession.tempoPausa,   
        ripetizioni: plainSession.ripetizioni, 
        nuovo: nuovo,
        nonFare:true,
    },
  });
    };

    

    const discardPomodoro = async (session) => {
      const token = sessionStorage.getItem('token');

      try {
        await axios.delete(`/api/pomRemove/${session._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
        incompleteSessions.value = incompleteSessions.value.filter(s => s._id !== session._id);
        window.location.reload();
      } catch (error) {
        console.error('Errore nello scartare la sessione pomodoro:', error.response?.data || error);
      }
    };


    const formatDate = (dateString) => {
      if (!dateString) return 'Data non disponibile';
      const date = new Date(dateString);
      return date instanceof Date && !isNaN(date)
        ? date.toLocaleDateString('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Data non valida';
    };


    const fetchOverdueActivities = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/activities/overdue', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });
        overdueActivities.value = response.data; 
      } catch (error) {
        console.error('Errore nel recupero delle attività scadute:', error);
      }
    };

    const filteredOverdueActivities = computed(() =>
      overdueActivities.value.filter(activity => activity.title && activity.deadline)
    );



      const markAsCompleted = async (activity) => {
      try {
        const token = sessionStorage.getItem('token');
        await axios.put(`/api/activities/${activity._id}`, { completed: true }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        activity.completed = true;
        activities.value = activities.value.filter(a => a._id !== activity._id);
        overdueActivities.value = overdueActivities.value.filter(a => a._id !== activity._id);
        window.location.reload();
      } catch (error) {
        console.error('Errore nel completare l\'attività:', error);
      }
    };

    const discardActivity = async (id) => {
  try {
    const token = sessionStorage.getItem('token');
    const username = localStorage.getItem('username');
    await axios.delete(`/api/activitiesRemove/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: {username: username}
    });
    fetchOverdueActivities();
    fetchActivities(); 
    overdueActivities.value = overdueActivities.value.filter(a => a._id !== id);
  } catch (error) {
    console.error('Errore nello scartare l\'attività:', error);
  }
};

   const getTimeMachine = async () => {

    try{
    const response = await axios.get('/api/getTime-machine');
    timeMachine.value = response.data

    } catch (error) {
      console.log("errore recupero data time machine" , error);
    }
   };

const fetchUnstartedSessions = async () => {
  try {
    
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');

        console.log('Token:', token);
        console.log('Username:', username);

        const response = await axios.get('/api/getSessioniNonPartite', {
          headers: { Authorization: `Bearer ${token}` },
          params: { username },
        });

       // console.log('Risposta:', response.data);

        unstartedSessions.value = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error('Errore nel recupero delle sessioni mai avviate:', error);
        unstartedSessions.value = []; 
      }
};



    onMounted(() => {
    //  fetchPoms();
      fetchEvents();
      fetchActivities();
      fetchOverdueActivities();
      fetchIncompleteSessions();
      fetchUnstartedSessions(); 
      pomNonAvviati();
      setInterval(getTimeMachine, 1000);    });

    return {
      events,
      activities,
      pomodoros, 
      incompleteSessions, 
      combinedPomodoros,
      unstartedSessions, 
      overdueActivities,
      formatDate,
      queryDate,
      navigateToAddEvent,
      navigateToAddActivity,
      navigateToAddPomodoro, 
      resumePomodoro, 
      discardPomodoro,
      confirmDeleteActivity,
      confirmDeleteEvent,
      confirmDeletePomodoro,
      //markActivityComplete ,
      markAsCompleted,
      filteredOverdueActivities,
      discardActivity,
      iniziaPomodoro,
      pomNonAvviati,
      timeMachine,
      isSameDay,
      currentUser,
      rejectEvent,
      exportToIcal
    };
  }
};


</script>

<style scoped>
.full-width {
  width: 100%;
  margin-bottom: 20px;
  background-color: rgba(230, 247, 255, 0.8);
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
}


.center-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.content-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 20px;
}

.pomodoro-container {
  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 20px;
}

.button-container {
  margin-top: auto; 
  margin-bottom: 10px; 
}

button {
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}





.section {
  margin-right: 100px;
  min-width: 500px;
  flex: 1.5; 
  padding: 25px;
  border: 1px solid #ddd; 
  border-radius: 10px; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); 
  background-color: rgba(255, 255, 255, 0.8); 
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
}

.section:hover {
  transform: scale(1.02); 
}

.activities-section {
  background-color: rgba(249, 249, 249, 0.8); 
}

.events-section {
  background-color: rgba(230, 247, 255, 0.8); 
}

.combined-pomodoros-section {
  width: 200%; 
  margin-bottom: 20px; 
  background-color: red;  
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
  flex: 1.5; 
}


hr {
  border: 0; 
  height: 1px; 
  background-color: #ddd; 
  margin: 10px 0; 
}
.item-container {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd; 
  border-radius: 8px; 
  padding: 15px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative; 
}

.delete-btn-c {
  position: absolute; 
  bottom: 10px;
  right: 10px; 
  background: none;
  border: none; 
  cursor: pointer; 
  font-size: 1.2em;
  color: #e74c3c; 
}
.delete-btn-cq {
  position: absolute; 
  bottom: 10px;
  right: 10px; 
  background: none;
  border: none; 
  cursor: pointer; 
  font-size: 1.2em;
  color: #e74c3c; 
}
.delete-btn-cqx {
  background: none;
  border: none; 
  cursor: pointer; 
  font-size: 1.2em;
  color: #e74c3c;
}
.delete-btn {
  position: absolute;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2em;
  color: #e74c3c;
}
.discard-btn {
  bottom: 10px;
  right: 10px;
}

.completed-btn {
  bottom: 30px;
  right: 10px;
}
.export-btn {
  position: absolute; 
  bottom: 50px;
  right: 10px; 
  background: none;
  border: none; 
  cursor: pointer; 
  font-size: 1.2em;
  color: #e74c3c; 
}

.delete-btn:hover {
  color: #c0392b; 
}
.export-btn:hover {
  color:#c0392b; 
}


@media (max-width: 600px) {
  .delete-btn, .export-btn {
    font-size: 0.9em;        
    right: 20px;   
    color: blue;         
  }

  .delete-btn-c {
    bottom: -10px;
    right: 200px;
  }
  .delete-btn-cq {
    font-size: 0.9em;
    bottom: -10px;
    right: -20px;
  }


  .delete-btn {
    bottom: -10px;           
  }
 
  .completed-btn {
    right: 100px;  
  }

  .export-btn {
    bottom: -10px;          
    right: 150px;
  }
  .content-container {
    flex-direction: column; 
    margin-left: 0; 
  }

  .section {
    min-width: auto; 
    margin-right: 0; 
    margin-bottom: 20px; 
  }
  .main-title {
  margin-top: 20px; 
}
}

.item-container {
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd; 
  border-radius: 8px; 
  padding: 15px; 
  margin-bottom: 15px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: relative; 
  transition: border-color 0.3s ease; 
}

.item-container.overdue {
  border-color: red;
  background-color: #ffe6e6;
}

.item-container.incpom {
  border-color: red;
  background-color: #ffe6e6;
}


.item-container.completed {
  border-color: green;
  box-shadow: 0 2px 8px rgba(0, 128, 0, 0.5); 
}

.complete-btn {
  background-color: #28a745; 
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.complete-btn:hover {
  background-color: #218838; 
}

.complete-btn:before {
  content: '✔️ '; 
  margin-right: 8px; 
}

.pomodoro-container {
  display: flex;
  justify-content: space-around; 
  flex-wrap: wrap; 
  gap: 20px; 
  margin: 20px auto; 
  max-width: 1200px; 
}

.pomodoro-container .section {
  flex: 1; 
  min-width: 300px; 
  max-width: 400px; 
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center; 
}


</style>