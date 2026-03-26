<template>
    <footer class="footer">
      <div class="container">
        <div class="text-center mt-4">
          <p>&copy; {{ currentYear }} Selfie App. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'AppFooter',
    data() {
      return {
        currentYear: new Date().getFullYear()
      };
    }
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #343a40;
    color: white;
    padding: 10px 0;
    width: 100%;    
  }
  
  .footer p {
    margin: 0;
    text-align: center;      
    font-size: 14px;
    color: #dcdcdc;
  }
  
  .footer a:hover {
    color: #ffffff;
  }

.container {
  padding-bottom: 20px; 
}
  </style>
  