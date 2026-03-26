<template>
  <div class="home-principale">
    <div class="container mt-3 text-center">
      <div class="row" style="height: 10%; width: 100%;">
        <div class="col-12">
          <h1 class="title">Ciao {{ username }}, bentornato su SELFIE</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 d-flex flex-column align-items-center">
          <img :src="gestisciImagePath" alt="Gestisci eventi e attività" class="img-left" />
          <div class="img-description-container">
            <p class="img-description">Con SELFIE, puoi gestire i tuoi eventi e le tue attività quotidiane in modo semplice e visualizzarle nel tuo calendario!</p>
          </div>
        </div>
        <div class="col-md-6 d-flex justify-content-center">
          <img :src="imagePath" alt="Homepage Design" class="img-fluid" />
        </div>
        <div class="col-md-3 d-flex flex-column align-items-center justify-content-center">
          <div class="img-description-container-2">
            <p class="img-description-2">SELFIE ti permette di creare delle note e di studiare con cicli di studio programmabili!</p>
          </div>
          <img :src="img2Path" alt="Immagine a destra" class="img-right" />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h2 class="reminder-title">Non scordare i tuoi prossimi impegni!</h2>
        </div>
      </div>














      <div class="home-preview" style="margin-top: 50px;">


   <div class="row">
  <div class="col-5 section-container">
    <div class="text-center p-4">
      <div class="form-group mt-3">
        <label for="eventSelect">Scegli preview:</label>
        <select id="eventSelect" v-model="isCurrentDay" @change="toggleEvent" class="custom-select event-select">
          <option :value="false">Ultimo Evento</option>
          <option :value="true">Evento del giorno corrente</option>
          <option :value="null">Tutti gli Eventi</option>
        </select>
      </div>

      <h2 class="section-title">
        {{ isCurrentDay === null ? 'Tutti gli Eventi' : (isCurrentDay ? 'Evento di Oggi' : 'Ultimo Evento') }}
      </h2>
      <p v-if="noEventsMessage">{{ noEventsMessage }}</p>

      <div v-if="isCurrentDay === null && allEvents.length > 0">
        <h3>Eventi Trovati:</h3>
        <ul>
          <li v-for="event in allEvents" :key="event.id">
            <strong>Titolo:</strong> {{ event.title || 'N/A' }}<br>
            <strong>Descrizione:</strong> {{ event.description || 'N/A' }}<br>
            <strong>Data:</strong> {{ formatDate(event.date) }}
          </li>
        </ul>
      </div>

      <div v-else-if="isCurrentDay">
        <ul>
          <li v-for="event in allEventCurrent" :key="event.id">
            <strong>Titolo:</strong> {{ event.title || 'N/A' }}<br>
            <strong>Descrizione:</strong> {{ event.description || 'N/A' }}<br>
            <strong>Data:</strong> {{ formatDate(event.date) }}
          </li>
        </ul>
      </div>

      <div v-else>
        <p>
          <strong>Titolo:</strong> {{ lastEventTitle }}<br>
          <strong>Descrizione:</strong> {{ lastEventDescription }}<br>
          <strong>Data:</strong> {{ formatDate(lastEventDate) }}
        </p>
      </div>
    </div>
  </div>


  <div class="col-5 section-container">
  <div class="form-group mt-3">
    <label for="activitySelect">Scegli preview:</label>
    <select id="activitySelect" v-model="isCurrentDayActivity" @change="toogleActivity" class="custom-select event-select">
      <option :value="false">Ultima attività</option>
      <option :value="true">Attività del giorno corrente</option>
      <option :value="null">Tutte le attività</option>
    </select>
  </div>

  <h2>
    {{ isCurrentDayActivity === null ? 'Tutte le Attività' : (isCurrentDayActivity ? 'Attività di Oggi' : 'Ultima Attività') }}
  </h2>
  
  <div v-if="isCurrentDayActivity === null && allActivities.length > 0">
    <h3>Attività Trovate:</h3>
    <ul>
      <li v-for="activity in allActivities" :key="activity.id">
        <strong>Titolo:</strong> {{ activity.title || 'N/A' }}<br>
        <strong>Descrizione:</strong> {{ activity.description || 'N/A' }}<br>
        <strong>Scadenza:</strong> {{ formatDate(activity.deadline) }}
      </li>
    </ul>
  </div>

  <div v-else-if="isCurrentDayActivity">
    <p v-if="currentDayActivities.length === 0">Non ci sono attività per oggi.</p>
    <ul v-if="currentDayActivities.length > 0">
      <li v-for="activity in currentDayActivities" :key="activity.id">
        <strong>Titolo:</strong> {{ activity.title || 'N/A' }}<br>
        <strong>Descrizione:</strong> {{ activity.description || 'N/A' }}<br>
        <strong>Scadenza:</strong> {{ formatDate(activity.deadline) }}
      </li>
    </ul>
  </div>

  <div v-else>
    <p v-if="!lastActivityTitle && !lastActivityDescription && !lastActivityDeadline">Non ci sono attività disponibili.</p>
    <div v-else>
      <strong>Titolo:</strong> {{ lastActivityTitle }}<br>
      <strong>Descrizione:</strong> {{ lastActivityDescription }}<br>
      <strong>Scadenza:</strong> {{ lastActivityDeadline }}
    </div>
  </div>
</div>

</div>


<div class="row" style="margin-top: 50px;">
  <div class="col-5 section-container">

<h2>Ultima Nota</h2>
    <p><strong>Titolo:</strong> {{ lastNoteHeading }}</p>

    <div v-if="!showNoteText">
      <p v-if="noNotesMessage">{{ noNotesMessage }}</p>

      <p v-else>
        <strong>Autore:</strong> {{ lastNoteAuthor }}
      </p>
      <button v-if="lastNoteHeading" class="btn btn-primary mt-3" style="background: white; color: black; " @click="getNoteText">Vedi testo completo della nota</button>
    </div>

    <div v-if="showNoteText" class="note-text">
      <p><strong>Testo completo:</strong></p>
      <div v-html="convertMarkdown(lastNoteText)"></div>
      <button class="btn btn-secondary mt-3" style="background: white; color: black; " @click="showNoteText = false">Torna indietro</button>
    </div>
  </div>
   
  <div class="col-5 section-container">
    <h2>Ultimo Pomodoro</h2>
                <p v-if="noPomodorosMessage">{{ noPomodorosMessage }}</p>
                <p v-else>
                   <strong>tempo studio prefissato:</strong> {{ lastPomodoroTempoStudio }}<br>
                   <strong>tempo pausa prefissato:</strong> {{ lastPomodoroTempoPausa }}<br>
                   <strong>ripetizioni prefissate:</strong> {{ lastPomodoroRipetizioni }}
                </p>
  </div>


</div>



  </div>

 


  <button class="fixed-button" @click="openNotificationModal" style="background:#f4a460; margin-bottom: 50px;">
  Vedi Notifiche
</button>

<button class="fixed-button" @click="openModal" style="background:#f4a460;">
  <i class="fas fa-paper-plane"></i>
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
             <li v-for="notification in notifications" :key="notification.id" class="notification-item">
              <span>Inviato da: <strong>{{ notification.username }}</strong></span><br />
              <span>{{ notification.message }}</span>
             <div class="notification-footer">
              <button @click="deleteNotification(notification._id)" class="delete-btn">🗑️</button>
            </div>
            <hr class="notification-separator" />
            </li>
           </ul>





          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeNotificationModal" style="background:#f4a460;">Chiudi</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal" @click.self="closeModal">
      <div class="modal-dialog">
        <div class="modal-content" style="background: linear-gradient(to bottom, #f4a460, #eee8aa);">
          <div class="modal-header">
            <h1 class="modal-title">Nuovo messaggio</h1>
          </div>
          <div class="modal-body">
            <form>
              <div class="form-group">
                <label for="recipient-name">Destinatario:</label>
                <select id="userSelect" v-model="selectedUsers" multiple class="form-control">
                  <option v-for="user in users" :key="user._id" :value="user._id">
                    {{ user.username }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="message-text">Messaggio:</label>
                <textarea class="form-control" id="message-text" v-model="notificationMessage"></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal" style="background:#f4a460;">Chiudi</button>
            <button class="btn btn-primary" @click="sendNotifications" style="background:#f4a460;">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>
    </div>




    </div>
  </div>
</template>


<script>


import axios from 'axios';
import { marked } from 'marked';
import homePageImage from '@/assets/images/homerrr.png';
import gestisciImmagine from '@/assets/images/img1.jpeg'; 
export default {
  name: 'HomePrincipale',

  data() {
    return {
      imagePath: homePageImage,
     gestisciImagePath: gestisciImmagine,
     isModalOpen: false,
     isNotificationModalOpen: false,
     img2Path: require('@/assets/images/img2.jpeg'), 
      username: localStorage.getItem('username'),
      lastEventTitle: '',
      lastEventDescription: '',
      lastEventDate: '',
      lastActivityTitle: '',
      lastActivityDescription: '',
      lastActivityDeadline: '',
      noActivitiesMessage: '',
      currentDayActivities: [],
      allActivities: [],

      notifications: [],
      noNotificationsMessage: '',

      users: [], 
      selectedUsers: [], 
      notificationMessage: '',
      lastNoteHeading: '',
      lastNoteAuthor: '',
      noEventsMessage: '',
      allEvents: [],
      allEventCurrent: [],
      noNotesMessage: '',
      noPomodorosMessage: '',
      lastPomodoroTempoStudio: '',
      lastPomodoroTempoPausa: '',
      lastPomodoroRipetizioni: '',
      currentEventTitle: '',
      currentEventDescription: '',
      currentEventDate: '',
      currentActivityTitle: '',
      currentActivityDescription: '',
      currentActivityDeadline: '',
      isCurrentDay: false,
      lastGroupActivity: '' ,
      lastNoteText: '',
      showNoteText: false,
      isCurrentDayActivity: false,
      notificationEnabled: false,
    };
  },
  mounted() {
    this.getLastEvent();
    this.getLastActivity();
    this.getNotifies();
    this.getUsers();
    this.getLastNote();
    this.getLastPomodoro();
  },
  methods: {

    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },

    openNotificationModal() {
      this.isNotificationModalOpen = true;
    },
    closeNotificationModal() {
      this.isNotificationModalOpen = false;
    },



    async getCurrentDayActivities() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');

        this.lastActivityTitle = '';
        this.lastActivityDescription = '';
        this.lastActivityDeadline = '';
        this.noActivitiesMessage = '';
        this.isCurrentDayActivity = false;

        const response = await axios.get('/api/activities/current-day', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        this.isCurrentDayActivity = true;

        if (response.data && response.data.length > 0) {
          this.currentDayActivities = response.data;
          this.noActivitiesMessage = '';
        } else {
          this.noActivitiesMessage = 'Non ci sono attività imminenti';
          this.isCurrentDayActivity = false;
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.noActivitiesMessage = 'Non ci sono attività imminenti';
          this.currentDayActivities = [];
        } else {
          console.error('Errore nel recupero delle attività del giorno corrente:', error);
          this.noActivitiesMessage = 'Errore nel caricamento delle attività del giorno corrente.';
          this.currentDayActivities = [];
        }
      }
    },

    async getLastActivity() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');

        this.lastActivityTitle = '';
        this.lastActivityDescription = '';
        this.lastActivityDeadline = '';
        this.noActivitiesMessage = '';

        const response = await axios.get('/api/activities/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        this.isCurrentDayActivity = false;


        if (response.data) {
          this.lastActivityTitle = response.data.title;
          this.lastActivityDescription = response.data.description;
          this.lastActivityDeadline = new Date(response.data.deadline).toLocaleDateString();
          this.lastGroupActivity = response.data.type;
          this.noActivitiesMessage = '';
          this.isCurrentDayActivity = false;
        } else {
          this.noActivitiesMessage = 'Non ci sono attività imminenti';
        }
      } catch (error) {
        console.error('Errore nel recupero delle attività:', error);
      }
    },

    async getAllActivity() {
      const token = sessionStorage.getItem('token');
      const username = localStorage.getItem('username');

      try {

        const response = await axios.get('/api/activitiesGET', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        if (response.data) {
          this.allActivities = response.data;
          this.noActivitiesMessage = '';
        } else {
          this.allActivities = [];
          this.noActivitiesMessage = '';
        }
      } catch (error) {
        console.error("error", error);
        this.noActivitiesMessage = 'errore nel recupero delle attivita';
      }
    },

    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return isNaN(d.getTime()) ? 'Data non valida' : d.toLocaleDateString();
    },

    toggleEvent() {
      if (this.isCurrentDay === null) {
        this.getAllEvents();
      } else if (this.isCurrentDay) {
        this.getCurrentDayEvents();
      } else {
        this.getLastEvent();
      }
    },


    toogleActivity() {

      if (this.isCurrentDayActivity === null) {
        this.getAllActivity();
      }

      else if (this.isCurrentDayActivity) {
        this.getCurrentDayActivities();
      }
      else {
        this.getLastActivity();
      }
    },


    async getAllEvents() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');

        const response = await axios.get('/api/eventsGET', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: username }
        });

        if (response.data && response.data.length > 0) {
          this.allEvents = response.data;
          this.noEventsMessage = '';
        } else {
          this.noEventsMessage = 'Non ci sono eventi disponibili';
          this.allEvents = [];
        }
      } catch (error) {
        console.error('Errore nel recupero di tutti gli eventi:', error);
        this.noEventsMessage = 'Errore nel caricamento di tutti gli eventi.';
        this.allEvents = [];
      }
    },


    async getCurrentDayEvents() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');

        this.lastEventTitle = '';
        this.lastEventDescription = '';
        this.lastEventDate = '';


        const response = await axios.get('/api/events/current-day', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });


        this.isCurrentDay = true;

        if (response.data && response.data.length > 0) {
          this.allEventCurrent = response.data;
          this.noEventsMessage = '';
        } else {
          this.noEventsMessage = 'Non ci sono eventi imminenti';
          this.allEventCurrent = [];
        }
      } catch (error) {
        console.error('Errore nel recupero degli eventi del giorno corrente:', error);
        this.noEventsMessage = 'Errore nel caricamento degli eventi del giorno corrente.';

        this.allEventCurrent = [];

      }

    },


    async getLastEvent() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/events/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });

        this.isCurrentDay = false;

        if (response.data) {
          this.lastEventTitle = response.data.title || 'Nessun evento';
          this.lastEventDescription = response.data.description || 'Nessuna descrizione';
          this.lastEventDate = response.data.date || 'Nessuna data';
          this.noEventsMessage = '';
        } else {
          this.noEventsMessage = 'Nessun evento trovato.';
          this.lastEventTitle = '';
          this.lastEventDescription = '';
          this.lastEventDate = '';
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'ultimo evento:', error);
        this.noEventsMessage = 'Errore nel caricamento dell\'ultimo evento.';
        this.lastEventTitle = '';
        this.lastEventDescription = '';
        this.lastEventDate = '';
      }
    },


    async getLastNote() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/notes/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: username }
        });

        if (response.data) {
          this.lastNoteHeading = response.data.heading;
          this.lastNoteAuthor = response.data.author;
          this.noNotesMessage = '';
        } else {
          this.noNotesMessage = 'Non ci sono note trovate';
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'ultima nota:', error);
        this.noNotesMessage = 'Errore nel caricamento dell\'ultima nota.';
      }
    },

    async getNoteText() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/notes/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: username }
        });

        if (response.data && response.data.content) {
          this.lastNoteText = response.data.content;
          this.showNoteText = true;
        } else {
          this.lastNoteText = 'Testo non disponibile';
        }
      } catch (error) {
        console.error('Errore nel recupero del testo della nota:', error);
        this.lastNoteText = 'Errore nel caricamento del testo della nota.';
      }
    },

    convertMarkdown(content) {
      return marked(content);
    },

    etNoteText() {
      this.showNoteText = true;
    },


    async getLastPomodoro() {
      try {
        const token = sessionStorage.getItem('token');
        const username = localStorage.getItem('username');
        const response = await axios.get('/api/poms/last', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { username: username }
        });

        if (response.data) {
          this.lastPomodoroTempoStudio = response.data.tempoStudio;
          this.lastPomodoroTempoPausa = response.data.tempoPausa;
          this.lastPomodoroRipetizioni = response.data.ripetizioni;
          this.noPomodorosMessage = '';
        } else {
          this.noPomodorosMessage = 'Nessun pomodoro trovato';
        }
      } catch (error) {
        console.error('Errore nel recupero dell\'ultimo pomodoro:', error);
        this.noPomodorosMessage = 'Errore nel caricamento dell\'ultimo pomodoro.';
      }
    },

   






    async getNotifies() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/notifications/getNotif', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });
        if (response.data) {
          this.notifications = response.data;
        } else {
          this.noNotificationsMessage = 'Nessuna notifica trovata.';
        }
      } catch (error) {
        console.error('Errore nel recupero delle notifiche :', error);
        this.noNotificationsMessage = 'Errore caricamento delle notifiche.';
      }
    },

    async getUsers() {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios.get('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: { author: this.username }
        });
        this.users = response.data;
      } catch (error) {
        console.error('Errore nel recupero degli utenti:', error);
      }
    },

    async sendNotifications() {
      if (this.selectedUsers.length === 0) {
        alert('Seleziona almeno un utente per inviare una notifica.');
        return;
      }

      if (this.notificationMessage.trim() === '') {
        alert('Scrivi un messaggio per inviare una notifica.');
        return;
      }

      try {
        const token = sessionStorage.getItem('token');
        const us = localStorage.getItem('username') ;

        await axios.post('/api/notifications/send', {
          recipients: this.selectedUsers,
          message: this.notificationMessage,
          username: us
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        alert('notifiche inviate!');
      } catch (error) {
        console.error('errore durante invio notifiche:', error);
        alert('Errore durante invio notifiche.');
      }
    },

    async deleteNotification(notificationId) {
      try {
        const token = sessionStorage.getItem('token');

        await axios.delete(`/api/notifications/${notificationId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        this.notifications = this.notifications.filter(notification => notification._id !== notificationId);
        alert('Notifica eliminata');
      } catch (error) {
        console.error('errore durante eliminazione notifica:', error);
        alert('errore durante leliminazione della notifica.');
      }
    },

  }

};
</script>

<style scoped>
.home-principale {
  display: flex;
  flex-direction: column; 
  justify-content: flex-start; 
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
  padding: 20px; 
}



.container {
  padding-bottom: 0;
}

.title {
  font-size: 2.5rem; 
  margin-bottom: 20px; 
  position: relative; 
  z-index: 1; 
}

.img-left {
  max-width: 150%; 
  height: auto; 
  max-height: 60%; 
  margin-top: 0px; 
  margin-left: -250px;
}

.img-right {
  max-width: 150%;
  height: auto;
  max-height: 60%;
  margin-right: -250px;
  margin-top: 150px;

}


.img-fluid {
  max-width: 100%; 
  height: auto; 
  max-height: 80%; 
  margin-top: 10px; 
  margin-right: 50px; 
}

.img-description-container {
  display: flex;
  justify-content: center; 
  align-items: center; 
  text-align: center;
  padding: 0 20px; 
  width: 700px;
}

.img-description-container-2 {
  display: flex;
  justify-content: center; 
  align-items: center; 
  text-align: center; 
  padding: 0 20px; 
  width: 500px;
  height: 2%;
  margin-left: 200px;
  margin-top: -40px;
}

.img-description-2 {
  font-family: 'Lora', serif;
  font-size: 1.2rem; 
  color: #333; 
  text-align: center; 
  padding: 10px; 
  line-height: 1.5; 
  margin-right: 0px;
  margin-top: 100px;
}

.img-description {
  font-family: 'Lora', serif;
  font-size: 1.2rem; 
  color: #333; 
  text-align: center;
  padding: 10px; 
  line-height: 1.5; 
  margin-right: 300px;
  margin-top: 30px; 
}

.reminder-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #4a4a4a;
  margin-bottom: 15px;
  text-align: center;
}


.form-group {
  margin-bottom: 20px;
  text-align: center;
}

.custom-select {
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #eee8aa;
  font-size: 1rem;
  color: #4a4a4a;
}

.event-content {
  padding: 10px;
}

.event-heading {
  font-size: 1.4rem;
  color: #555;
  text-align: center;
  margin-bottom: 15px;
}

.event-list {
  list-style: none;
  padding: 0;
}

.event-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.event-item strong {
  color: #333;
}

.no-events {
  font-style: italic;
  color: #999;
  text-align: center;
}

.events-section {
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #333; 
}

.event-select {
  background-color: #EEE8AA;
  color: #333; 
  border: none;
  border-radius: 4px;
  padding: 5px;
}

.event-select:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); 
}

.event-select option {
  color: black; 
}

.section-container {
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.events-section,
.event-section {
  background: inherit; 
}


.row > .col-5:not(:last-child) {
  margin-right: 150px; 
}



.fixed-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 20px;
  background-color: #007bff; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1000; 
}

.fixed-button:hover {
  background-color: #0056b3; 
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
  margin-bottom: 50px; 
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
  .home-preview {
    margin-top: 30px; 
  }

  .row {
    flex-direction: column; 
    align-items: stretch; 
  }

  .section-container {
    width: 100%; 
    margin-bottom: 20px; 
    padding: 20px; 
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    background-color: #fff; 
    border-radius: 5px;
  }

  h2.section-title {
    margin-bottom: 10px; 
  }

  .form-group {
    margin-bottom: 20px; 
  }


  .img-left,
  .img-right {
    max-width: 100%; 
    height: auto; 
    margin: 0 auto;
    display: block; 
  }

  .img-right {
    margin-top: 50px;
  }
  .img-description-container,
  .img-description-container-2 {
    width: 90%; 
    margin: 0 auto; 
    text-align: center;
  }

  .fixed-button {
    width: 90%; 
    margin: 10px auto;
    display: block;
  }

  .title,
  .reminder-title,
  .img-description,
  .img-description-2 {
    text-align: center; 
    margin: 10px 0; 
  }

  .title {
    font-size: 2rem; 
  }

  .reminder-title {
    font-size: 1.5rem; 
  }

  .img-description,
  .img-description-2 {
    font-size: 1rem; 
  }
  .img-description-2 {
    margin-top: 10%;
  }

  .img-fluid {
    max-width: 100%;
    max-height: 100%;
    height: auto; 
    margin: 0 auto; 
    display: block; 
  }
}





</style>