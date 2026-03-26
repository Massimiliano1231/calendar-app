<template>
  <div class="registration">
    <h1 class="registration__header">SELFIE</h1> 
    <div class="registration__container">
      <img src="@/assets/images/logo.png" alt="Logo" class="registration__logo" />
      <h1 class="registration__title">Registrati</h1>
      <form @submit.prevent="registerUser">
        <div class="registration__field">
          <i class="registration__icon fas fa-user"></i>
          <input v-model="user.username" id="username" class="registration__input" placeholder="Nome Utente" required />
        </div>
        <div class="registration__field">
          <i class="registration__icon fas fa-envelope"></i>
          <input v-model="user.email" id="email" class="registration__input" placeholder="Email" type="email" required />
        </div>
        <div class="registration__field">
          <i class="registration__icon fas fa-lock"></i>
          <input v-model="user.password" type="password" id="password" class="registration__input" placeholder="Password" required />
        </div>
        <button class="registration__submit" type="submit">Registrati</button>
        <p v-if="message" class="message">{{ message }}</p>
      </form>
      <a class="registration__link" href="/">Torna alla Login</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',      
        password: ''
      },
      message: ''
    };
  },
  methods: {
    async registerUser() {
      try {
        const response = await axios.post('/api/register', this.user);
        console.log('Utente registrato:', response.data);
        this.message = 'Registrazione avvenuta con successo!';
        this.$router.push('/');
        this.user = {
          username: '',
          email: '',       
          password: ''
        };
      } catch (error) {
        if (error.response && error.response.status === 400) {
          this.message = 'Nome utente già presente. Scegli un altro nome utente.';
        } else {
          this.message = 'Errore durante la registrazione.';
        }
        console.error('Errore:', error);
      }
    }
  }
};
</script>

<style scoped>
.registration {
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.registration__header {
  text-align: center; 
  color: #fff;
  font-size: 48px;
  margin-bottom: 20px; 
}

.registration__container {
  background: linear-gradient(to bottom, #f4a460, #eee8aa); 
  border-radius: 20px;
  box-shadow: 0px 0px 24px #5C5696;
  width: 360px;
  padding: 30px;
  position: relative;
}

.registration__logo {
  display: block;
  margin: 0 auto 20px; 
  max-width: 100%; 
  height: auto;
}

.registration__title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
}

.registration__field {
  margin-bottom: 20px;
  position: relative;
}

.registration__icon {
  position: absolute;
  top: 15px;
  color: #7875B5;
}

.registration__input {
  border: none;
  border-bottom: 2px solid #D1D1D4;
  background: none;
  padding: 10px;
  padding-left: 30px;
  font-weight: 700;
  width: 100%;
  transition: .2s;
}

.registration__input:focus,
.registration__input:hover {
  outline: none;
  border-bottom-color: #6A679E;
}

.registration__submit {
  background: #fff;
  font-size: 14px;
  padding: 16px 20px;
  border-radius: 26px;
  border: 1px solid #D4D3E8;
  text-transform: uppercase;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #4C489D;
  box-shadow: 0px 2px 2px #5C5696;
  cursor: pointer;
  transition: .2s;
}

.registration__submit:focus,
.registration__submit:hover {
  border-color: #6A679E;
  outline: none;
}

.message {
  color: black;
  text-align: center;
  margin-top: 10px;
}

.registration__link {
  display: block;
  text-align: center;
  color: #f4a460;
  text-decoration: none;
  font-weight: 700;
  margin-top: 20px;
  cursor: pointer;
}
</style>
