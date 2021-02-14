const mqtt = require('mqtt');
const config = require('./config/default');
const SmartmeterObis = require('smartmeter-obis');

const mqttClient  = mqtt.connect('mqtt://' + config.mqtt.server, {
    will: {
        topic: config.mqtt.topic + '/state',
        payload: 'disconnected',
        ...config.mqtt.options
    }
});

var smTransport = SmartmeterObis.init({
    protocol: 'SmlProtocol',
    transport: 'SerialResponseTransport',
    transportSerialPort: config.serialDevice
}, (error, result) => {
    if (error) {
        mqttClient.publish(config.mqtt.topic + '/state', 'disconnected', config.mqtt.options);
        return console.error(error);
    }

    console.log('Received new SML result');
    for (var id in result) {
        mqttClient.publish(config.mqtt.topic + '/' + result[id].idToString(), result[id].valueToString(), config.mqtt.options);
    }
});

mqttClient.publish(config.mqtt.topic + '/state', 'connected', config.mqtt.options);
smTransport.process();