<template>
  <div class="account-utente">
    <div class="teext">
      <h1>Account</h1>
    </div>
    
    <div class="personal-data">
      <h2>Dati Personali</h2>
      <p><strong>Username:</strong> {{ username }}</p>
      <p><strong>Email:</strong> {{ email }}</p>
    </div>

    <div class="manage-password">
      <h2>Gestisci Password</h2>
      <form @submit.prevent="updatePassword">
        <div class="mb-3">
          <label for="currentPassword" class="form-label">Password Attuale</label>
          <input type="password" class="form-control" id="currentPassword" v-model="currentPassword" required>
        </div>
        <div class="mb-3">
          <label for="newPassword" class="form-label">Nuova Password</label>
          <input type="password" class="form-control" id="newPassword" v-model="newPassword" required>
        </div>
        <button type="submit" class="btn btn-primary">Aggiorna Password</button>
      </form>
    </div>


  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AccountUtente',
  data() {
    return {
      username: localStorage.getItem('username') || 'Guest',
      email: localStorage.getItem('email') || '', 
      currentPassword: '',
      newPassword: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async updatePassword() {
  try {
    const token = sessionStorage.getItem('token');
    const response = await axios.put('/api/updatePassword', {
      username: this.username,
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }, {
      headers: {
        Authorization: `Bearer ${token}` 
      }
    });

    this.successMessage = response.data.message || 'Password aggiornata con successo!';
    this.errorMessage = '';

    this.currentPassword = '';
    this.newPassword = '';
    this.$router.push('/'); 
  } catch (error) {
    this.errorMessage = error.response?.data?.message || 'Errore durante l\'aggiornamento della password.';
    console.log("errore", error);
    this.successMessage = '';
  }
},

  
  }
};
</script>

<style scoped>
.account-utente {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.personal-data,
.manage-password,
.delete-account {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.error {
  color: red;
}

.success {
  color: green;
}

.teext {
  margin: 10px 0;
}
</style>




