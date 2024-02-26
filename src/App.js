import '@ionic/react/css/core.css';
import { IonApp, IonButton, IonCard, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonTitle, setupIonicReact } from '@ionic/react';
import { useEffect, useState } from 'react';

setupIonicReact();
const App = () => {

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  
  const onClickHandler = () => {
    fetch("http://192.168.1.6:8081/api/v1/person/")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error.message))
  }

  return (
    <>
      <IonApp>
        <IonHeader style={{ padding: "10px" }}>
          <IonTitle>Garage RFID</IonTitle>
        </IonHeader>
        <IonContent style={{ padding: "10px" }}>
          <IonButton onClick={onClickHandler}>
            Carica
          </IonButton>
          {data.length > 0 && data.map(user => (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>{user.name}</IonCardTitle>
              </IonCardHeader>
            </IonCard>
          ))}
          {error && <p>{error}</p>}
        </IonContent>
      </IonApp>
    </>
  )
}

export default App;
