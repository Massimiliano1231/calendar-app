<template>
  <nav class="navbar bg-body-tertiary">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        
      </div>

        

      <div class="d-flex ms-auto align-items-center">
        <a class="navbar-brand me-4" href="/homePrincipale">
            <i class="fas fa-home"></i>
        </a>

        <a class="me-4" href="/accountUtente">
            <i class="fas fa-user" style="color: black;"></i>
            <span class="username-initials">{{ username }}</span>
        </a>

       

        

      </div>



      <div class="d-flex ms-auto align-items-center time-machine-form">
  <input type="date" v-model="selectedDate" class="form-control form-control-sm me-2" />
  <input type="time" v-model="selectedTime" class="form-control form-control-sm me-2" />
  <button @click="activateTimeMachine" class="btn btn-sm btn-primary">cambia orario</button>
  <button @click="resetTimeMachine" class="btn-sm btn-primary">reset time machine</button>
</div>


<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <span class="nav-item username-text">Benvenuto, {{ username }}!</span>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/todo">Note</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="eventDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Eventi
              </a>
              <ul class="dropdown-menu" aria-labelledby="eventDropdown">
                <li><a class="dropdown-item" href="/addEvent">Aggiungi evento</a></li>
            <!--    <li><a class="dropdown-item" href="/eventsE">Lista eventi</a></li> -->
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="activityDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Attività
              </a>
              <ul class="dropdown-menu" aria-labelledby="activityDropdown">
                <li><a class="dropdown-item" href="/addActivities">Aggiungi attività</a></li>
             <!--   <li><a class="dropdown-item" href="/ActivitiesPage">Lista attività</a></li> -->
              </ul>
            </li>
            <li class="nav-item"><a class="nav-link" href="/calendarEvent">Calendario</a></li>
            <li class="nav-item"><a class="nav-link" href="/pomodoroTempo">Pomodoro</a></li>
           <!-- <li class="nav-item"><a class="nav-link" href="/pomSession">Sessioni Pomodoro</a></li> -->
          </ul>
          <button class="btn btn-dark mt-3" @click="logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>
  
<script>

import axios from 'axios';
import moment from 'moment-timezone';


  export default {
    data() {
      return {
        username: localStorage.getItem('username') || 'Guest',
        showNotifications: false,
        notifications: [] ,
        timeMachineDate: '',  
        timeMachineTime: ''  ,
        selectedDate: '', 
        selectedTime: ''
      };
    }, 
    computed:{
      currentPage() {
        const routeNameMap = {
          '/': 'Login', 
          '/homePrincipale': 'Home',
          '/pomodoroTempo': 'Pomodoro',
          '/todo': 'Lista Note',
          '/calendarEvent': 'Calendario',
          '/addEvent': 'Aggiungi Evento',
          '/eventsE': 'Lista Eventi',
          '/addActivities': 'Aggiungi Attività',
          '/activities': 'Lista Attività',
          '/pomSession': 'Sessioni Pomodoro',
          '/accountUtente': 'Gestisci il tuo Account',
        };
        return routeNameMap[this.$route.path] || ''; 
      },
     
    },

    mounted() {
  this.fetchData();  
},


    methods:{


      async resetTimeMachine() {
    try {
        const token = sessionStorage.getItem('token'); 
        const response = await axios.post('/api/time-machine/reset', {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        this.selectedDate = ''; 
        this.selectedTime = ''; 

        alert('Time Machine resettata alla data di sistema!');
        window.location.reload();
        console.log(response.data);
        this.fetchData(); 
    } catch (error) {
        console.error('Errore nel reset della Time Machine:', error);
        alert('Si è verificato un errore durante il reset della Time Machine');
    }
},



      async fetchData() {
    try {
        const response = await axios.get('/api/getTime-machine'); 
        console.log("get time machine", response.data);

     //   const localDate = moment(response.data.date).tz('Europe/Rome', true).format();
      //  console.log("Data convertita nel fuso orario locale:", localDate);
    } catch (error) {
        console.error('Errore nella richiesta GET:', error);
    }
},



  async activateTimeMachine() {
    if (!this.selectedDate || !this.selectedTime) {
        alert('Per favore seleziona una data e un\'ora!');
        return;
    }

    const timeMachineData = {
        date: moment(`${this.selectedDate}T${this.selectedTime}:00`).tz('Europe/Rome').format()
    };

    try {
        const token = sessionStorage.getItem('token'); 
        const response = await axios.post('/api/updateTime-machine', timeMachineData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert('Time Machine attivata con successo!');
        console.log(response.data);
        window.location.reload();
        this.fetchData();
    } catch (error) {
        console.error('Errore nell\'attivazione della Time Machine:', error);
        alert('Si è verificato un errore durante l\'attivazione della Time Machine');
    }
},


      
     


      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.clear();
        sessionStorage.clear();
        this.$router.push('/');
      },


  
      
      
    }
    
    
  };

</script>

<style scoped>

.time-machine-form input,
.time-machine-form button {
  width: 150px;
}


.form-control-sm {
  font-size: 0.8rem; 
  padding: 0.375rem 0.75rem; 
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem; 
}


.form-control-sm {
  font-size: 0.8rem; 
  padding: 0.375rem 0.75rem; 
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem; 
}

.carousel-item {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #000;
  border-radius: 50%;
}

.navbar {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

.nav-link {
  padding: 10px 15px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
}

.btn-danger {
  margin-left: 10px;
}


.btn-danger:hover {
  background-color: #c82333;
  transition: background-color 0.3s;
}

.username-text{
  color: #1100ff; 
  font-weight: bold;
}




.notifications-dropdown {
  position: absolute;
  top: 50px; 
  right: 10px;
  width: 200px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000; 
}

.notifications-dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.notifications-dropdown li {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.notifications-dropdown li:last-child {
  border-bottom: none;
}

.notifications-dropdown button {
  margin-top: 10px;
  width: 100%; 
}

@media (max-width: 767px) {
  .time-machine-form input,
  .time-machine-form button {
    width: 70px; 
  }

  .form-control-sm {
    font-size: 0.7rem; 
    padding: 0.3rem 0.6rem; 
  }

  .btn-sm {
    padding: 0.3rem 0.6rem; 
    font-size: 0.7rem; 
  }

  .notifications-dropdown {
    width: 160px; 
  }
}

</style>
