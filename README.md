- PROGETTO SELFIE
  . È stato sviluppato utilizzando **Node.js** per il backend e **Vue.js** per il frontend, con MongoDB come database.

---

## Struttura del Progetto

### **1. Cartella Root**

La cartella principale del progetto contiene i file di configurazione e il server principale:

- **`server.js`**: Avvia il server Node.js e definisce le configurazioni principali.

---

### **2. Cartella `/routes`**

Questa cartella contiene i file per la definizione delle rotte API.  
Ogni file rappresenta un set di rotte relative a una specifica funzionalità.

### **3. Cartella `/controllers`**

Contiene i file con la logica per gestire le richieste del server e inviare le risposte.

### **4. Cartella `/models`**

Contiene i modelli Mongoose che definiscono la struttura dei dati utilizzati dall'applicazione.

### **5. Cartella `/frontend`**

La cartella `/frontend` contiene il codice sorgente del frontend dell'applicazione, sviluppato utilizzando **Vue.js**.

#### **Struttura della Cartella**

All'interno di `/frontend`, troviamo la sottocartella `src`, che contiene:

- **`components`**:  
  La quale contiene il Footer, navBar e la pagina per la gestione degli alert per le notifiche.

- **`views`**:  
  Contiene le viste principali dell'applicazione, ognuna corrisponde a una pagina o schermata.  
  Esempi:
  - **Registrazione**: Permette agli utenti di creare un nuovo account.
  - **Login**: Consente agli utenti di autenticarsi nell'applicazione.
  - **Home Principale**: Mostra una panoramica delle attività e degli alert.
