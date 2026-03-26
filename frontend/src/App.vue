<template>
  <div id="App">
    <Nav v-if="!isLoginPage && !isRegisterPage" />
    
    <div class="container">
      <router-view/>
    </div>

    <Notifiche />     

    <AppFooter v-if="!isLoginPage && !isRegisterPage"/>
  </div>
</template>

<script>
import AppFooter from './components/AppFooter.vue';
import Nav from './components/NavigationBar.vue';
import Notifiche from './components/NotificationComponent.vue'; 

export default {
  name: 'App', 
  components: {
    Nav,
    AppFooter,
    Notifiche,
  },
  computed: {
    isLoginPage() {
      return this.$route.path === '/';
    },
    isRegisterPage() {
      return this.$route.path === '/registratiAccedi';  
    }
  },
}; 
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

#App {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
}

.container {
  flex: 1; 
}
</style>
