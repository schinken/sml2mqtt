const mqtt = require('mqtt');
const config = require('./config/default');
const SmartmeterObis = require('smartmeter-obis');

const mqttClient  = mqtt.connect('mqtt://' + config.mqtt.server);

var smTransport = SmartmeterObis.init({
    protocol: 'SmlProtocol',
    transport: 'SerialResponseTransport',
    transportSerialPort: config.serialDevice
}, (error, result) => {
    if (error) {
        return console.error(error);
    }
    
    console.log('Received new SML result');
    for (var id in result) {
        mqttClient.publish(config.mqtt.topic + '/' + result[id].idToString(), result[id].valueToString(), config.mqtt.options);
    }
});

smTransport.process();
console.log('Attached to ' + config.serialDevice);