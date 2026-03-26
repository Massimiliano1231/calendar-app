<template>
  <div class="login">
    <h1 class="login__header">SELFIE</h1>
    <div class="login__container">
      <img src="@/assets/images/logo.png" alt="Logo" class="login__logo" />
      <h1 class="login__title">Login</h1>
      <form @submit.prevent="login">
        <div class="login__field">
          <i class="login__icon fas fa-user"></i>
          <input v-model="username" type="text" id="username" class="login__input" placeholder="Username" required />
        </div>
        <div class="login__field">
          <i class="login__icon fas fa-lock"></i>
          <input v-model="password" type="password" id="password" class="login__input" placeholder="Password" required />
        </div>
        <button class="login__submit" type="submit">
          <span class="button__text">Login</span>
        </button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      <a class="menu__item" href="/registratiAccedi">Registrati</a>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('/api/auth/login', {
          username: this.username,
          password: this.password
        });

        const token = response.data.token;
        sessionStorage.setItem('token', token);

        localStorage.setItem('username', this.username);
        const userEmail = response.data.email; 
        localStorage.setItem('email', userEmail);

        
        this.$router.push('/homePrincipale'); 
      
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    }
  }
};
</script>

<style scoped>

.login {
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
  display: flex;
  flex-direction: column; 
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.login__header {
  text-align: center; 
  color: #fff;
  font-size: 80px; 
  margin-bottom: 100px; 
}

.login__container {
  background: linear-gradient(to bottom, #f4a460, #eee8aa);
  border-radius: 20px;
  box-shadow: 0px 0px 24px #5C5696;
  width: 360px;
  padding: 30px;
  position: relative;
}

.login__logo {
  display: block;
  margin: 0 auto 20px; 
  max-width: 100%; 
  height: auto; 
}

.login__title {
  text-align: center;
  color: #fff;
  margin-bottom: 20px;
}

.login__field {
  margin-bottom: 20px;
  position: relative;
}

.login__icon {
  position: absolute;
  top: 15px;
  color: #7875B5;
}

.login__input {
  border: none;
  border-bottom: 2px solid #D1D1D4;
  background: none;
  padding: 10px;
  padding-left: 30px;
  font-weight: 700;
  width: 100%;
  transition: .2s;
}

.login__input:focus,
.login__input:hover {
  outline: none;
  border-bottom-color: #6A679E;
}

.login__submit {
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

.login__submit:focus,
.login__submit:hover {
  border-color: #6A679E;
  outline: none;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.menu__item {
  display: inline-block;
  color: #f4a460;
  text-decoration: none;
  font-weight: 700;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
}

</style>
