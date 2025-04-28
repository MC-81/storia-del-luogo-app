exports.handler = async function(event, context) {
  // Ottieni le coordinate dalla richiesta
  const { lat, long } = event.queryStringParameters;
  
  // Converti le stringhe in numeri
  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);
  
  // Database di luoghi (sostituisci con i tuoi luoghi specifici)
  const locations = [
    { name: "Colosseo", lat: 41.8902, long: 12.4922, url: "https://it.wikipedia.org/wiki/Colosseo", radius: 0.5 },
    { name: "Prova", lat: 41.923738, long: 12.394568, url: "https://drive.google.com/file/d/1tOy-L20Wb2dGyv8f0_5QFM0d_QJnoAJU/view?usp=drive_link", radius: 0.5 },
    { name: "Torre di Pisa", lat: 43.7230, long: 10.3966, url: "https://it.wikipedia.org/wiki/Torre_pendente_di_Pisa", radius: 0.3 },
    { name: "Duomo di Milano", lat: 45.4641, long: 9.1919, url: "https://it.wikipedia.org/wiki/Duomo_di_Milano", radius: 0.2 }
    // Aggiungi altri luoghi qui
  ];
  
  // Funzione per calcolare la distanza tra due punti in km
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raggio della Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  
  // Controlla se siamo in un'area predefinita
  for (const location of locations) {
    const distance = getDistance(latitude, longitude, location.lat, location.long);
    if (distance <= location.radius) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ 
          found: true, 
          location: location 
        })
      };
    }
  }
  
  // Nessuna corrispondenza trovata
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify({ found: false })
  };
};
