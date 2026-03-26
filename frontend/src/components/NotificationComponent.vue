<template>
  <div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      alerts: [],  
      seenAlerts: new Set(),  
    };
  },
  created() {
    this.startPolling();  
  },
  methods: {
  startPolling() {

    
    
    setInterval(async () => {

      const token = sessionStorage.getItem('token');
      if (!token) {
        return; 
      }
      try {
        const response = await axios.get('/api/get-latest-alert', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const data = response.data;
        if (data.alerts && data.alerts.length > 0) {
          const username = localStorage.getItem('username');
          const filteredAlerts = data.alerts.filter(alert => alert.userNome.toLowerCase() === username.toLowerCase());
          
          if (filteredAlerts.length > 0) {
            this.alerts = filteredAlerts;
            filteredAlerts.forEach(alertItem => {
              alert(`Evento: ${alertItem.title}\nData: ${new Date(alertItem.date).toLocaleDateString()}\nOrario: ${alertItem.startTime}`);
            });
          }
        }
      } catch (error) {
        console.error('Errore nel polling:', error);
      }
    }, 5000); // Intervallo di 5 secondi
  }
}


};
</script>

<style scoped>

</style>
