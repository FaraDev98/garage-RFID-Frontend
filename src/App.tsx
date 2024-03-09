import "@ionic/react/css/core.css";
import {
  IonApp,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonProgressBar,
  IonText,
  IonTitle,
  IonToolbar,
  setupIonicReact,
} from "@ionic/react";
import { useEffect, useState } from "react";
import {
  BLEConnectToDevice,
  BLEGetResponse,
  BLEInitialize,
  BLERequestDevice,
  BLESendRequest,
  main,
} from "./bluetooth/main";
import "./App.css";
import { BleClient, BleDevice } from "@capacitor-community/bluetooth-le";

setupIonicReact();

const App = () => {
  // const [data, setData] = useState([]);
  // const [error, setError] = useState(null);
  const [reachedNetworks, setReachedNetworks] = useState<string[]>([]);
  const [connected, setConnected] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const [device, setDevice] = useState<BleDevice>();
  const [deviceEnabled, setDeviceEnabled] = useState<boolean>();

  const onClickHandler = async () => {
    const deviceFound = await BLERequestDevice();
    const connected = await BLEConnectToDevice(deviceFound);
    setDevice(deviceFound);
    setConnected(connected);
  };

  const searchNetworks = async () => {
    setLoading(true);
    console.log(device, connected);
    if (device && connected) {
      await BLESendRequest(device, "scan");
      const networks = await BLEGetResponse(device);

      let netNames = [];
      for (let i = 0; i < +networks; i++) {
        await BLESendRequest(device, `d:${i.toString()}`);
        const netName = await BLEGetResponse(device);
        netNames.push(netName);
      }
      setReachedNetworks((state) => [...state, ...netNames]);
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await BLEInitialize();
      const enabled = await BleClient.isEnabled();
      setDeviceEnabled(enabled);
      if (!deviceEnabled) {
        await BleClient.requestEnable();
      }
    };
    init();
  });

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
      />
      <IonApp>
        <IonHeader className="header" mode="md">
          <IonToolbar color="primary" className="toolbar">
            <IonTitle className="p-4">HOMECLOUD</IonTitle>
            {loading ? (
              <IonProgressBar
                type="indeterminate"
                color="light"
              ></IonProgressBar>
            ) : null}
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonButton onClick={onClickHandler}>Scansiona</IonButton>
          {connected ? (
            <IonButton onClick={searchNetworks}>cerca reti</IonButton>
          ) : null}
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Reti disponibili</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {reachedNetworks.length > 0 ? (
                <>
                  {reachedNetworks.map((network) => (
                    <div className="card-list-item">
                      <button className="flex w-full">
                        <IonCardSubtitle className="d-block">
                          {network}
                        </IonCardSubtitle>
                        <span className="material-symbols-outlined">
                          network_wifi_locked
                        </span>
                      </button>
                    </div>
                  ))}
                </>
              ) : null}
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonApp>
    </>
  );
};

export default App;
