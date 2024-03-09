import { BleClient, numbersToDataView, numberToUUID, hexStringToDataView } from '@capacitor-community/bluetooth-le';

const GARAGE_SERVICE = '19B10000-E8F2-537E-4F6C-D104768A1214';
const SWITCH_CHARACTERISTIC = '19B10001-E8F2-537E-4F6C-D104768A1214';
const SWITCH_RESPONSE_CHARACTERISTIC = '19B10001-E8F2-537E-4F6C-D104768A1215';

export async function main() {
    try {
        await BleClient.initialize();

        const device = await BleClient.requestDevice({
            services: [],
        });

        // connect to device, the onDisconnect callback is optional
        await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
        console.log('connected to device', device);
        var enc = new TextEncoder();
        var string = "Vodafone";
        await BleClient.write(device.deviceId, GARAGE_SERVICE, SWITCH_CHARACTERISTIC, enc.encode(string));

        const result = await BleClient.read(device.deviceId, GARAGE_SERVICE, SWITCH_RESPONSE_CHARACTERISTIC);
        console.log('Rete disponibile', result);

        const length = result.byteLength;
        let response = "";
        for (let i = 0; i < length; i++) {
            response += String.fromCharCode(result.getUint8(i));
        }
        console.log(response);
        // const battery = await BleClient.read(device.deviceId, BATTERY_SERVICE, BATTERY_CHARACTERISTIC);
        // console.log('battery level', battery.getUint8(0));

        // await BleClient.write(device.deviceId, POLAR_PMD_SERVICE, POLAR_PMD_CONTROL_POINT, numbersToDataView([1, 0]));
        // console.log('written [1, 0] to control point');

        // await BleClient.startNotifications(
        //     device.deviceId,
        //     GARAGE_SERVICE,
        //     SWITCH_RESPONSE_CHARACTERISTIC,
        //     (value) => {
        //         console.log('RETE DISPONIBILE', value);
        //         const length = value.byteLength;
        //         for (let i = 0; i < length; i++) {
        //             console.log(String.fromCharCode(value.getUint8(i)));
        //         }
        //     }
        // );
        BleClient.
            // // // disconnect after 10 sec
            setTimeout(async () => {
                await BleClient.disconnect(device.deviceId);
                console.log('disconnected from device', device);
            }, 10000);
    } catch (error) {
        console.error(error);
    }
}

function onDisconnect(deviceId) {
    console.log(`device ${deviceId} disconnected`);
}

export const BLEInitialize = async () => {
    await BleClient.initialize();
}

export const BLERequestDevice = async () => {
    const device = await BleClient.requestDevice({
        services: [GARAGE_SERVICE],
    });

    // connect to device, the onDisconnect callback is optional
    return device;
}

export const BLEConnectToDevice = async (device) => {
    await BleClient.connect(device.deviceId, (deviceId) => onDisconnect(deviceId));
    console.log('connected to device', device);
    return true;
}

export const BLEDisconnectDevice = async (device) => {
    await BleClient.disconnect(device.deviceId);
    console.log('connected to device', device);
}

export const BLEGetResponse = async (device) => {
    const result = await BleClient.read(device.deviceId, GARAGE_SERVICE, SWITCH_RESPONSE_CHARACTERISTIC);
    console.log('Rete disponibile', result);

    const length = result.byteLength;
    let response = "";
    for (let i = 0; i < length; i++) {
        response += String.fromCharCode(result.getUint8(i));
    }
    return response;
}

export const BLESendRequest = async (device, reqCode) => {
    var enc = new TextEncoder();
    await BleClient.write(device.deviceId, GARAGE_SERVICE, SWITCH_CHARACTERISTIC, enc.encode(reqCode));
}
