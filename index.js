const mqtt = require('mqtt');
const config = require('./config/default');
const SmartmeterObis = require('smartmeter-obis');

function log(severity, message) {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    console.log(`[${timestamp}] ${severity} - ${message}`);
}

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
        return log('ERR', error.message);
    }

    log('INFO', 'Received SML message with ' + Object.keys(result).length + ' topics');
    for (var id in result) {
        mqttClient.publish(config.mqtt.topic + '/' + result[id].idToString(), result[id].valueToString(), config.mqtt.options);
    }
});

mqttClient.publish(config.mqtt.topic + '/state', 'connected', config.mqtt.options);
log('INFO', 'Waiting for SML messages on ' + config.serialDevice);

smTransport.process();