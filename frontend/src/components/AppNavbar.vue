<template>
  <div>
    <!-- Navbar Collapse -->
    <div class="collapse" id="navbarToggleExternalContent">
      <div class="bg-white p-4">
        <ul class="navbar-nav d-flex justify-content-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/homePrincipale" @click="closeNavbar">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pomodoroTempo" @click="closeNavbar">Pomodoro</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/todo" @click="closeNavbar">Lista Note</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/calendarEvent" @click="closeNavbar">Calendario</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/addEvent" @click="closeNavbar">Aggiungi evento</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/eventsE" @click="closeNavbar">Lista eventi</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/addActivities" @click="closeNavbar">Aggiungi attività</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/activities" @click="closeNavbar">Lista attività</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/pomSession" @click="closeNavbar">Sessioni Pomodoro</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/accountUtente" @click="closeNavbar">Gestisci il tuo Account</router-link>
          </li>
          <li class="nav-item">
            <button class="nav-link" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>

   
    
  </div>
</template>

<script>
import { Collapse } from 'bootstrap';
import { EventBus } from '@./EventBus';

export default {
  data() {
    return {
      timeMachineDate: '',  
      timeMachineTime: '',  
      simulatedTime: '--:--:--', 
      intervalId: null, 
      currentSimulatedTime: null 
    };
  },
  computed: {
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
    showTimeMachine() {
      const routesWithTimeMachine = [
        'eventDayCalendar', 
        '/calendarEvent',      
        '/eventsE',            
        '/activities',         
        '/pomSession'          
      ];
      return routesWithTimeMachine.includes(this.$route.path);
    }
  },
  methods: {
    closeNavbar() {
      const navbarCollapse = document.getElementById('navbarToggleExternalContent');
      if (navbarCollapse) {
        const bsCollapse = Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    },
    toggleNavbar() {
      const navbarCollapse = document.getElementById('navbarToggleExternalContent');
      if (navbarCollapse) {
        const bsCollapse = Collapse.getOrCreateInstance(navbarCollapse);
        bsCollapse.toggle(); 
      }
    },
    logout() {
      localStorage.clear();
      this.isAut=false;
      console.log("autenticato:", this.isAut);
      this.$router.push('/'); 
    },
    setTimeMachine() {
      if (this.timeMachineDate && this.timeMachineTime) {
        const newDateTime = new Date(`${this.timeMachineDate}T${this.timeMachineTime}`);
        this.currentSimulatedTime = newDateTime; 
        this.simulatedTime = this.currentSimulatedTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        this.startTimeFlow();
        EventBus.emit('timeMachineSet', this.currentSimulatedTime);
      }
    },
    resetTimeMachine() {
      clearInterval(this.intervalId); 
      this.simulatedTime = '--:--:--'; 
      this.currentSimulatedTime = null;
      EventBus.emit('timeMachineReset');
    },
     startTimeFlow() {
      clearInterval(this.intervalId);
      this.intervalId = setInterval(() => {
        if (this.currentSimulatedTime) {
          this.currentSimulatedTime.setSeconds(this.currentSimulatedTime.getSeconds() + 1);
          this.simulatedTime = this.currentSimulatedTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          
          EventBus.emit('timeMachineUpdate', this.currentSimulatedTime);
        }
      }, 1000);
    }
  },
  created() {
    EventBus.$on('timeMachineReset', () => {
      clearInterval(this.intervalId);
      this.simulatedTime = '--:--:--';
      this.currentSimulatedTime = null;
    });
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
    EventBus.$off('timeMachineReset');
  }
};
</script>



<style scoped>
.navbar {
  margin-top: 0;
  padding-top: 0;
  border: none;
}

.navbar-page-title {
  font-size: 1.2rem;
  font-weight: 600;
}

.ms-3 {
  margin-left: 1rem;
}

.collapse {
  margin: 0;
  padding: 0;
}

.time-machine-control {
  display: flex;
  align-items: center;
}

.time-machine-control input {
  margin-right: 10px;
  padding: 5px;
  border-radius: 8px; 
  border: 1px solid #ccc; 
  outline: none;
}

.time-machine-control button {
  margin-right: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 8px 15px;
  font-size: 0.9em;
  border-radius: 10px;
  cursor: pointer;
}

.time-machine-control button:hover {
  background-color: #0056b3;
}

.welcome-message {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  text-align: center;
}

</style>
