
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const SMTP_SERVICE = process.env.SMTP_SERVICE || 'gmail';
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM || (SMTP_USER ? `"Servizio Sito SELFIE"<${SMTP_USER}>` : '"Servizio Sito SELFIE"<noreply@example.com>');

const isEmailConfigured = Boolean(SMTP_USER && SMTP_PASS);

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      service: SMTP_SERVICE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    })
  : null;

if (!isEmailConfigured) {
  console.warn('Email non configurata: imposta SMTP_USER e SMTP_PASS per abilitare l invio delle notifiche.');
}



const sendMail=(mailOptions)=>{
  if (!transporter) {
    console.warn('Trasporto email non configurato: invio saltato.');
    return;
  }

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
    from: MAIL_FROM,
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
    from: MAIL_FROM,
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
    from: MAIL_FROM,
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
