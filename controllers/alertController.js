const { v4: uuidv4 } = require('uuid');

let alerts = []; 

exports.getLatestAlerts = async (req, res) => {
  try {
    const unseenAlerts = alerts.filter(alert => !alert.seen);

    res.json({
      alerts: unseenAlerts,
    });

    unseenAlerts.forEach(alert => {
      alert.seen = true; 
    });

  } catch (error) {
    console.error('Errore nel recupero degli alert:', error);
    res.status(500).json({ message: 'Errore nel recupero degli alert' });
  }
};

exports.addAlert = (title, date, startTime, userNome) => {
  const newAlert = { 
    id: uuidv4(), 
    title, 
    date, 
    startTime, 
    userNome,
    seen: false,  
  };
  alerts.push(newAlert);
};
