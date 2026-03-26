<template>
  <div class="event-form">
    <h1>Sessione Pomodoro</h1>
    <form @submit.prevent="aggiungiPomodoro">
      <div>
        <label for="tempoStudio">Tempo di studio (minuti):</label>
        <input type="number" v-model="newPom.tempoStudio" min="1" required>
      </div>

      <div>
        <label for="tempoPausa">Tempo di pausa (minuti):</label>
        <input type="number" v-model="newPom.tempoPausa" min="1" required>
      </div>

      <div>
        <label for="ripetizioni">Numero di ripetizioni:</label>
        <input type="number" v-model="newPom.ripetizioni" min="1" required>
      </div>

      <div>
        <label for="giorno">Giorno della sessione:</label>
        <input type="date" v-model="newPom.giorno" required>
      </div>

      <button type="submit" class="rounded-btn">Aggiungi Sessione</button>
    </form>

    <p id="studio-pausa">{{ statusMessage }}</p>


     <div class="progress-bar-container">
      <div class="progress-bar" :style="{ width: progressWidth + '%' }"></div>
    </div>

    <div class="timer" id="timerDisplay">00:00</div>

    <div class="controls">
  <div class="button-row">
    <button @click="skipPhase">Salta alla fase successiva</button>
    <button @click="restartCycle">Ricomincia ciclo</button>
  </div>
  <div class="button-row">
    <button @click="endCycle">Termina ciclo</button>
    <button @click="pauseTimer">Stoppa timer</button>
    <button v-if="isPaused" @click="resumeTimer">Riprendi timer</button> 
  </div>
</div>

  </div>



                   <button class="fixed-button" @click="openNotificationModal" style="background:#f4a460; margin-bottom: 10px;">
                  Vedi Notifiche
                    </button>


                    <div v-if="isNotificationModalOpen" class="modal" @click.self="closeNotificationModal">
      <div class="modal-dialog">
        <div class="modal-content" style="background: linear-gradient(to bottom, #f4a460, #eee8aa);">
          <div class="modal-header">
            <h1 class="modal-title fs-5">Notifiche</h1>
          </div>
          <div class="modal-body">
            <p>Qui puoi visualizzare tutte le notifiche ricevute.</p>
            <ul>
              <li v-for="(notifica, index) in notificationsPom" :key="index">
      <p><strong>INVITATO DA:</strong> {{ notifica.username }}</p>
      <p><strong>TEMPO STUDIO:</strong> {{ notifica.tempoStudio }} minuti</p>
      <p><strong>TEMPO PAUSA:</strong> {{ notifica.tempoPausa }} minuti</p>
      <p><strong>RIPETIZIONI:</strong> {{ notifica.ripetizioni }}</p>
      <p><strong>GIORNO:</strong> {{ new Date(notifica.giorno).toLocaleDateString() }}</p>
                  <button @click="rifiutaNotifica(notifica._id)" class="delete-btn">🗑️</button>
                  <button  @click="accettaNotifica(
                    notifica._id,
                  Number(notifica.tempoStudio), 
                  Number(notifica.tempoPausa), 
                   Number(notifica.ripetizioni),  
                     notifica.giorno)" style="background: #f4a460;">accetta</button>
      <hr> ●●●●●
    </li>
           </ul>





          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeNotificationModal" style="background:#f4a460;">Chiudi</button>
          </div>
        </div>
      </div>
    </div>



   <button class="fixed-button" @click="openHelpStudy" style="background:#f4a460; margin-bottom: 10px;">
                  Non sai come studiare?
                    </button>


                    <div v-if="isHelpStudyOpen" class="modal" @click.self="closeHelpStudy" style="background: #f4a460;">
                      <div class="modal-dialog">
        <div class="modal-content" style="background: linear-gradient(to bottom, #f4a460, #eee8aa);">
          <div class="modal-header">
            <h1 class="modal-title">iinsersici qui quanti minuti hai a disposizione:</h1>
          </div>
          <form>
            <div class="form-group">
              <label for="recipient-name">minuti a disposizione:</label>
               <input type="number" v-model="minutiDisponibili">
               <button type="button" @click="studyHelp">calcola</button>
             </div>
                  </form>

                  <h4>hai a disposizione:</h4>
                  <div v-if="risultatiCicli.length > 0">
        <ul>
          <li v-for="(cycle, index) in risultatiCicli" :key="index">{{ cycle }}</li>
        </ul>
      </div>

          
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeHelpStudy" style="background:#f4a460;">Chiudi</button>
           
          </div>
        </div>
      </div>

                    </div>

                  
    

  <button class="fixed-button" @click="openModal"  style="background:#f4a460;">
  <i class="fas fa-paper-plane"></i>
</button>


<div v-if="isModalOpen" class="modal" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content" style="background: linear-gradient(to bottom, #f4a460, #eee8aa);">
          <div class="modal-header">
            <h1 class="modal-title">invita un amico a studiare con le tue impostazioni:</h1>
          </div>
          <form>
  <div class="form-group">
    <label for="recipient-name">Destinatario:</label>
    <select id="userSelect" v-model="selectedUsers" multiple class="form-control">
      <option v-for="user in users" :key="user._id" :value="user._id">
        {{ user.username }}
      </option>
    </select>
  </div>
</form>

          <div class="modal-body">
              <div class="form-group">
                <label for="recipient-name">invita:</label>
                <button class="btn btn-primary" @click="sendNotificationPom" style="background:#f4a460;">
              <i class="fas fa-paper-plane"></i>
            </button>
                
              </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal" style="background:#f4a460;">Chiudi</button>
           
          </div>
        </div>
      </div>
    </div>


</template>

<script>
import { ref, onMounted,  onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';


export default {
  setup() {



    const route = useRoute();

    const newPom = ref({
      username: localStorage.getItem('username') || 'Guest',
      tempoStudio: 30,  
      tempoPausa: 5,    
      ripetizioni: 5,  
      giorno: ''
    });
    
   const statusMessage = ref('');
    let studyCycles = ref(parseInt(route.query.studyCycles) || newPom.value.ripetizioni);
    let timerInterval = null;
    let isStudyPhase = ref(route.query.isStudyPhase === 'true');
    let remainingTime = ref(parseInt(route.query.remainingTime) || 0);
    let isPaused = ref(false);
    const progressWidth = ref(0);
    let isModalOpen = ref(false);
    let isNotificationModalOpen = ref(false);
    const users = ref([]); 
    const selectedUsers = ref([]);
    let notificationsPom = ref([]);
    const noNotificationsMessage = ref('');
    let isHelpStudyOpen = ref(false);
    const minutiDisponibili = ref(0); 
    let  risultatiCicli = ref([]);


  onMounted(() => {

    if (route.query.date && !isNaN(new Date(route.query.date).getTime())) {
  newPom.value.giorno = new Date(route.query.date).toISOString().split('T')[0];
} else {
  newPom.value.giorno = new Date().toISOString().split('T')[0];
}


    getUsers();



    const query = route.query;
    
    if (Object.keys(query).length > 0 && route.query.nonFare === 'true'){


  if(route.query.nuovo === 'false'){
  newPom.value.tempoStudio = route.query.tempoStudio
    ? parseInt(route.query.tempoStudio)
    : newPom.value.tempoStudio;

  newPom.value.tempoPausa = route.query.tempoPausa
    ? parseInt(route.query.tempoPausa)
    : newPom.value.tempoPausa;

  newPom.value.ripetizioni = route.query.ripetizioni
    ? parseInt(route.query.ripetizioni)
    : newPom.value.ripetizioni;

  remainingTime.value = route.query.remainingTime
    ? parseInt(route.query.remainingTime)
    : 0;

  studyCycles.value = route.query.studyCycles
    ? parseInt(route.query.studyCycles)
    : newPom.value.ripetizioni;

  isStudyPhase.value = route.query.isStudyPhase
    ? route.query.isStudyPhase === 'true'
    : true;


  

  if (remainingTime.value > 0) {
    document.getElementById('timerDisplay').textContent = formatTime(remainingTime.value);

    if (isStudyPhase.value) {
      startTimerWithRemainingTime();
    } else {
      startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
    }
  }

}  
  else {
    studyCycles.value = newPom.value.ripetizioni;
    startNewCycle();
  }

}

});





    onUnmounted(() => {
      clearInterval(timerInterval); 
    });

    const startNewCycle = () => {
  newPom.value.tempoStudio = route.query.tempoStudio ? parseInt(route.query.tempoStudio) : newPom.value.tempoStudio;
  newPom.value.tempoPausa = route.query.tempoPausa ? parseInt(route.query.tempoPausa) : newPom.value.tempoPausa;
  newPom.value.ripetizioni = route.query.ripetizioni ? parseInt(route.query.ripetizioni) : newPom.value.ripetizioni;
  studyCycles.value = route.query.studyCycles ? parseInt(route.query.studyCycles) : newPom.value.ripetizioni;
  remainingTime.value = route.query.remainingTime ? parseInt(route.query.remainingTime) : 0;
  isStudyPhase.value = route.query.isStudyPhase === 'true';

  
  if (remainingTime.value > 0) {
    document.getElementById('timerDisplay').textContent = formatTime(remainingTime.value);

    if (isStudyPhase.value) {
      startStudyTimer(newPom.value.tempoStudio, studyCycles.value);
    } else {
      startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
    }
  } else {

    startStudyTimer(newPom.value.tempoStudio, studyCycles.value);
  }
};




    const updateProgressBar = (totalTime) => {
      const percentage = ((totalTime - remainingTime.value) / totalTime) * 100;
      progressWidth.value = Math.min(percentage, 100);
    };



    const getUsers = async () => {
      try {
        const username = localStorage.getItem('username');
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });
        users.value = response.data; 
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
      }
    };


    const aggiungiPomodoro = async () => {

      const currentDate = new Date();
  const pomDate = new Date(newPom.value.giorno);

  currentDate.setHours(0, 0, 0, 0);

  if (pomDate < currentDate) {
      alert("Data non valida"); 
    return; 
  }


  try {
    const token = sessionStorage.getItem('token');
    const currentDate = new Date();
    const selectedDate = new Date(newPom.value.giorno);

    const response = await axios.post('/api/pomsPOST', newPom.value, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Sessione pomodoro aggiunta:', response.data);

    if (selectedDate.getTime() > currentDate.getTime()) {
      statusMessage.value = 'Sessione pomodoro aggiunta per una data futura.';
    } else {
      studyCycles.value = newPom.value.ripetizioni;

      const pomodoroId = response.data._id; 
      try {
  const startResponse = await axios.post(
    `/api/iniziaPomodoro/${pomodoroId}`,
    {}, 
    {
      headers: { Authorization: `Bearer ${token}` } 
    }
  );
  console.log(startResponse);


  startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
} catch (startError) {
  console.error('Errore durante l\'avvio del pomodoro:', startError);
  statusMessage.value = 'Errore durante l\'avvio del pomodoro.';
}

     
    }
  } catch (error) {
    console.error('Errore:', error);
    statusMessage.value = 'Errore durante l\'aggiunta del pomodoro.';
  }
};



    const aggiungiPomDaNotifica = async (notificationId , tempoStudio , tempoPausa , ripetizioni , giorno) => {
      
      try {
        const token = sessionStorage.getItem('token');
        const currentDate = new Date();


        const newPomDaNot = ref({
          username: localStorage.getItem('username'),
          tempoStudio: tempoStudio , 
          tempoPausa: tempoPausa,
          ripetizioni: ripetizioni ,
          giorno: giorno
        });

        const response = await axios.post('/api/pomsPOST', newPomDaNot.value, {
          headers: { Authorization: `Bearer ${token}` }
        });

        alert("perfetto, sessione aggiunta al tuo calendario!\n ora la notifica verrà eliminata"); 
        console.log(response);

        const giornoDate = new Date(giorno);

        if(giornoDate.getTime() > currentDate.getTime()) {
          statusMessage.value = 'sessione pomodoro aggiunta per una data futura';
        }  else {
          const pomodoroId = response.data._id; 
      try {
  const startResponse = await axios.post(
    `/api/iniziaPomodoro/${pomodoroId}`,
    {}, 
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  console.log('Pomodoro avviato:', startResponse.data);

  startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
} catch (startError) {
  console.error('Errore durante l\'avvio del pomodoro:', startError);
  statusMessage.value = 'Errore durante l\'avvio del pomodoro.';
}
          studyCycles.value = ripetizioni;
          startStudyTimer(tempoStudio, studyCycles.value , tempoPausa);
        }

        rifiutaNotifica(notificationId);


      } catch (error) {
        console.error("errore salvataggio pomodoro da notifica:", error);
      }

    };


     
    const fetchInvitiPom = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/getNotifichePom', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });
        if (response.data) {
          notificationsPom.value = response.data;
        } else {
          this.noNotificationsMessage = 'Nessuna notifica trovata.';
        }
      } catch (error) {
        console.error('Errore nel recupero delle notifiche :', error);
        this.noNotificationsMessage = 'Errore caricamento delle notifiche.';
      }
    };



        const accettaNotifica = async ( notificationId ,username , tempoStudio , tempoPausa , ripetizioni , giorno) => {
        
          aggiungiPomDaNotifica( notificationId , username , tempoStudio , tempoPausa , ripetizioni , giorno);
          
           

        };


        const rifiutaNotifica = async (notificationId) => {
  const token = sessionStorage.getItem('token');

  try {
    await axios.delete(`/api/rifiutaNotifica/${notificationId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    notificationsPom.value = notificationsPom.value.filter(
          notifica => notifica._id !== notificationId
  );
    alert("Notifica eliminata");

  } catch (error) {
    console.log("errore rifiuta notifica pom", error);
  }
};

         


      
   const startTimerWithRemainingTime = () => {
      isPaused.value = false;
      clearInterval(timerInterval);
      const totalTime = isStudyPhase.value ? newPom.value.tempoStudio * 60 : newPom.value.tempoPausa * 60;
      timerInterval = setInterval(() => {
        updateTimer(totalTime);
      }, 1000);
    };

    const startStudyTimer = (studyTime, cycles) => {
      if (cycles <= 0) {
        alert('Ciclo completato!');
        return;
      }
      statusMessage.value = `Studio! Numero cicli rimanenti: ${cycles}`;
      remainingTime.value = studyTime * 60;
      isStudyPhase.value = true;
      isPaused.value = false;
      progressWidth.value = 0;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(studyTime * 60);
      }, 1000);
    };


    const openModal  =  () =>  {
      isModalOpen.value = true;
    };
    const closeModal  =  () =>  {
      isModalOpen.value = false;
    };

    const openNotificationModal = () => {
       isNotificationModalOpen.value = true;
       fetchInvitiPom();
    };

    const closeNotificationModal = () => {
      isNotificationModalOpen.value = false;
    }

    const openHelpStudy = () => {
       isHelpStudyOpen.value = true;
    };

    const closeHelpStudy = () => {
      isHelpStudyOpen.value = false;
    };

    const studyHelp = () => {
    const totalMinutes = minutiDisponibili.value; 

    let studyTime, breakTime, numberOfCycles;
    const cycles = [];
    
    if(totalMinutes < 25) {
      cycles.push('troppo poco tempo per studiare!');
    }

    if (totalMinutes < 45) {
        studyTime = 20;
        breakTime = 5;
    } else if (totalMinutes < 120) {
        studyTime = 35;
        breakTime = 5;
    } else {
        studyTime = 45;
        breakTime = 10;
    }


    numberOfCycles = Math.floor(totalMinutes / (studyTime + breakTime));


    const remainingTime = totalMinutes % (studyTime + breakTime);


    
    for (let i = 0; i < numberOfCycles; i++) {
        cycles.push(`Ciclo ${i + 1}: ${studyTime} minuti di studio e ${breakTime} minuti di pausa`);
    }


    if (remainingTime > 0 && totalMinutes >= 25) {
        cycles.push(`resta questo tempo: ${remainingTime}`);
    }


    risultatiCicli.value = cycles;
};



    const sendNotificationPom = async () => {
  const token = sessionStorage.getItem('token');
  const username = localStorage.getItem('username');


  try {
    await axios.post(
      '/api/sendNoticationPom',
      {
        username,
        tempoStudio: newPom.value.tempoStudio,
        tempoPausa: newPom.value.tempoPausa,
        ripetizioni: newPom.value.ripetizioni,
        destinatario: selectedUsers.value,
        giorno: newPom.value.giorno
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    alert("notifica mandata con successo");
  } catch (error) {
    console.error("Errore invio notifica pomodoro", error);
  }
};




     const startBreakTimer = (pauseTime, cycles) => {
      if (cycles <= 0) {
        alert('Ciclo completato!');
        return;
      }
      statusMessage.value = `Pausa! Numero cicli rimanenti: ${cycles}`;
      remainingTime.value = pauseTime * 60;
      isStudyPhase.value = false;
      isPaused.value = false;
      progressWidth.value = 0;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        updateTimer(pauseTime * 60);
      }, 1000);
    };
    
    const updateTimer = (totalTime) => {
      if (remainingTime.value > 0) {
        remainingTime.value -= 1;
        document.getElementById('timerDisplay').textContent = formatTime(remainingTime.value);
        updateProgressBar(totalTime);
      } else {
        clearInterval(timerInterval);
        studyCycles.value--;
        if (isStudyPhase.value) {
          startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
        } else {
          startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
        }
      }
    };

    const formatTime = (timeInSeconds) => {
      const minutes = Math.floor(timeInSeconds / 60);
      const seconds = timeInSeconds % 60;
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };


    const skipPhase = () => {
      clearInterval(timerInterval);
      progressWidth.value = 0;

      if (isStudyPhase.value) {
        studyCycles.value--;
        startBreakTimer(newPom.value.tempoPausa, studyCycles.value);
      } else {
        startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
      }

      if (studyCycles.value <= 0) {
        saveIncompleteSession();
        statusMessage.value = "Ciclo completato!";
        document.getElementById('timerDisplay').textContent = "00:00";
      }
    };

    const restartCycle = () => {
      clearInterval(timerInterval);
      studyCycles.value = newPom.value.ripetizioni;
      progressWidth.value = 0;
      startStudyTimer(newPom.value.tempoStudio, studyCycles.value, newPom.value.tempoPausa);
    };

    const endCycle = () => {
      clearInterval(timerInterval);
      studyCycles.value = 0;
      progressWidth.value = 0;
      statusMessage.value = 'Ciclo terminato manualmente.';
      document.getElementById('timerDisplay').textContent = "00:00";
      saveIncompleteSession();
    };

    const pauseTimer = () => {
      clearInterval(timerInterval);
      isPaused.value = true;
      saveIncompleteSession();
    };

    const resumeTimer = () => {
      isPaused.value = false;
      const totalTime = isStudyPhase.value ? newPom.value.tempoStudio * 60 : newPom.value.tempoPausa * 60;

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
      updateTimer(totalTime);
      }, 1000); 
  };

    const saveIncompleteSession = async () => {
      const token = sessionStorage.getItem('token');
      const username = newPom.value.username.trim();

      try {
        await axios.post('/api/poms/save-incomplete', {
          username,
          giorno: new Date(newPom.value.giorno).toISOString(), 
          remainingTime: remainingTime.value,
          isStudyPhase: isStudyPhase.value,
          studyCycles: studyCycles.value,
          tempoStudio: newPom.value.tempoStudio, 
          tempoPausa: newPom.value.tempoPausa
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Incomplete session saved.');
      } catch (error) {
        console.error('Error saving incomplete session:', error);
      }
    };

    return {
      newPom,
      statusMessage,
      aggiungiPomodoro,
      skipPhase,
      restartCycle,
      endCycle,
      pauseTimer,
      resumeTimer,
      isPaused, 
      progressWidth,
      openModal,
      closeModal,
      isModalOpen,
      sendNotificationPom,
      getUsers,
      users,
      selectedUsers,
      openNotificationModal,
      closeNotificationModal,
      isNotificationModalOpen,
      fetchInvitiPom,
      notificationsPom,
      noNotificationsMessage,
      accettaNotifica,
      rifiutaNotifica,
      aggiungiPomDaNotifica,
      openHelpStudy,
      isHelpStudyOpen,
      closeHelpStudy,
      studyHelp,
      minutiDisponibili,
      risultatiCicli
    };
  }
};


</script>



<style scoped>
#clock {
  margin-top: 20px;
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0; 
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background-color: green;
  width: 0%;
  transition: width 1s linear;
}

.timer {
  font-size: 2em;
  text-align: center;
  margin-bottom: 10px;
}

form {
  max-width: 400px;
  margin: auto;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button.rounded-btn {
  border-radius: 20px; 
}


.controls {
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center; 
}

.controls button {
  padding: 10px;
  margin: 10px; 
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.button-row {
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 10px; 
}

.controls button {
  flex: 1; 
  margin-right: 10px; 
}

.controls button:last-child {
  margin-right: 0;
}

#clock {
  margin-top: 40px;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; 
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.fixed-button:nth-of-type(1) {
  bottom: 90px;
}

.fixed-button:nth-of-type(2) {
  bottom: 50px; 
}

.fixed-button:nth-of-type(3) {
  bottom: 20px; 
}


.notification-item {
  padding: 10px; 
}

.notification-separator {
  border: none; 
  height: 5px; 
  background-color: blue;
  margin: 10px 0; 
}

.notification-item:last-child .notification-separator {
  display: none; 
}


.notification-item {
  position: relative;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc; 
}

.notification-footer {
  position: absolute; 
  bottom: 30px; 
  right: 10px; 
}

.delete-btn {
  background: none;
  border: none; 
  cursor: pointer;
}


@media (max-width: 600px) {
  h1 {
    margin-top: 30px; 
  }

  .controls button {
    margin-right: 10px; 
  }
}



</style>



<style scoped>
#clock {
  margin-top: 20px;
}

.progress-bar-container {
  width: 100%;
  height: 20px;
  background-color: #e0e0e0; 
  overflow: hidden;
  margin-bottom: 20px;
}

.progress-bar {
  height: 100%;
  background-color: green;
  width: 0%;
  transition: width 1s linear;
}

.timer {
  font-size: 2em;
  text-align: center;
  margin-bottom: 10px;
}

form {
  max-width: 400px;
  margin: auto;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

button.rounded-btn {
  border-radius: 20px; 
}


.controls {
  margin-top: 20px;
  margin-bottom: 40px;
  display: flex; 
  flex-wrap: wrap; 
  justify-content: center; 
}

.controls button {
  padding: 10px;
  margin: 10px; 
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.button-row {
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 10px; 
}

.controls button {
  flex: 1; 
  margin-right: 10px; 
}

.controls button:last-child {
  margin-right: 0;
}

#clock {
  margin-top: 40px;
}


.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001; 
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.fixed-button:nth-of-type(1) {
  bottom: 90px; 
}

.fixed-button:nth-of-type(2) {
  bottom: 50px; 
}

.fixed-button:nth-of-type(3) {
  bottom: 20px; 
}


.notification-item {
  padding: 10px; 
}

.notification-separator {
  border: none; 
  height: 5px; 
  background-color: blue;
  margin: 10px 0; 
}

.notification-item:last-child .notification-separator {
  display: none; 
}


.notification-item {
  position: relative;
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc; 
}

.notification-footer {
  position: absolute; 
  bottom: 30px; 
  right: 10px; 
}

.delete-btn {
  background: none;
  border: none; 
  cursor: pointer;
}


@media (max-width: 600px) {
  .fixed-button {
  position: fixed; 
    right: 10px; 
  padding: 8px 15px; 
  font-size: 0.8rem; 
}




 

  .controls button {
    padding: 6px 12px;  
    font-size: 0.9rem; 
    margin: 5px;         
  }

  
  h1 {
    margin-top: 30px; 
  }

  .controls button {
    margin-right: 10px; 
  }
}



</style>
