
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply@example.com',
    pass: 'REDACTED_MAIL_APP_PASSWORD',
  },
});



const sendMail=(mailOptions)=>{
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Errore nell invio email:', error);
    } else {
      console.log('Email inviata:', info.response);
    }
  });
};


const sendReminderEmail = (email, activities) => {

  let emailContent = 'Ciao! Ecco le attività in scadenza nei prossimi 2 giorni:\n\n';

  activities.forEach(activity => {
    emailContent += `- ${activity.title} (scadenza: ${activity.deadline.toLocaleDateString()})\n`;
  });

  const mailOptions = {
    from: '"Servizio Sito SELFIE"<noreply@example.com>',
    to: email,
    subject: 'Promemoria: Attività in scadenza tra 2gg',
    text: emailContent,
  };
  sendMail(mailOptions);
};


const sendNotifEmail = (recipientEmail, eventDetails) => {
  const formattedDate = new Date(eventDetails.date).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const mailOptions = {
    from: '"Servizio Sito SELFIE"<noreply@example.com>',
    to: recipientEmail,
    subject: 'NON DIMENTICARTI L EVENTO:',
    html: `
       <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #2c3e50;">L'evento "${eventDetails.title}"</h2>
        <p style="font-size: 16px;">
          <strong>📅 Data:</strong> ${formattedDate}<br>
          <strong>🕒 Ora di inizio:</strong> ${eventDetails.startTime}<br>
          <strong>📍 Luogo:</strong> ${eventDetails.location}<br>
          <strong>⏳ Durata:</strong> ${eventDetails.duration} minuti
          <p style="font-size: 14px;">Non mancare! Preparati per l'evento.</p>
        <p style="font-size: 14px;">Grazie,<br>Il Team SELFIE</p>
        </p>        
      </div>
    `
  };
  sendMail(mailOptions);
};


const sendNotifEmailActivity = (recipientEmail, activityDetails) => {
  const formattedDeadline = new Date(activityDetails.deadline).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const mailOptions = {
    from: '"Servizio sito SELFIE"<noreply@example.com>',
    to: recipientEmail,
    subject: 'NON DIMENTICARTI L ATTIVITÀ:',
    html: `
       <div style="font-family: Arial, sans-serif;">
        <h2 style="color: #2c3e50;">L'attività "${activityDetails.title}"</h2>
        <p style="font-size: 16px;">
          <strong>📅 Scadenza:</strong> ${formattedDeadline}<br>
          <strong>🕒 Descrizione:</strong> ${activityDetails.description}<br>
          <p style="font-size: 14px;">Non mancare! </p>
        <p style="font-size: 14px;">Grazie,<br>Il Team SELFIE</p>
        </p>        
      </div>
    `
  };
  sendMail(mailOptions);
};




module.exports = { sendReminderEmail, sendNotifEmail, sendNotifEmailActivity };

