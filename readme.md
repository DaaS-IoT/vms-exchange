# DaaS-IoT Exchange SDK

> APIs to interact with VMS and EPs

Useful for easily exchange data between EPs and you application.

## Install

```
$ npm install sebyone_/daas-iot-echange-sdk
```

## Usage

Here you'll find several examples on how to use the lib.

### Add an EP to the list of managed EP, inizitalize the VMS and bind the EP

```js
import { vmsList, exchange } from 'sebyone_/daas-iot-echange-sdk';

const ep = 'THE EP...'; // given an EP 

vmsList.addRecorder(ep.din, vmsUri, () => {
    console.log('closed connection fo din: ' + device.din);
});

await exchange.initializeVms(
    device.din,
    '/api/exchange/notifications', // the path where the VMS will push the notification
    'http://localhost:3000', // the base url of the application listening for notifications
);

await exchange.bindRecorder(din);
```

### Unbind a recorder and remove it from the list of managed EP

```js
import { vmsList, exchange } from 'sebyone_/daas-iot-echange-sdk';

const ep = 'THE EP...'; // given an EP 

await exchange.unbindRecorder(ep.din);

vmsList.removeRecorder(ep.din);
```
### Classic way to fetch the newly available measurements

```js
import { exchange } from 'sebyone_/daas-iot-echange-sdk';

const ep = 'THE EP...' // given an EP 

const measurementsCount = await exchange.getMeasurementsCount(ep.din);

for (let i = 0; i < measurementsCount; i++) {
    // get the measurement object
    const measurement = await exchange.getMeasurement(din);
    
    // get the values
    const values = [];
    for (let j = 0; j < measurement.total_blocks; j++) {
        values.concat(await exchange.getMeasurementValues(din, measurement.id, j));
    }

    // OPTIONAL: delete the measurement
    await exchange.deleteMeasurement(din, measurement.id);
}
```

### Nwq way to fetch the newly available measurements

```js
import { exchange } from 'sebyone_/daas-iot-echange-sdk';

const ep = 'THE EP...' // given an EP 

const measurementsCount = await exchange.getMeasurementsCount(ep.din);

for (let i = 0; i < measurementsCount; i++) {
    // get the measurement object
    const measurement = await exchange.getMeasurementWithValues(din, deleteOnGet = false|true);
    // no the measurement object has a "values" property containing the measurement data
}

```