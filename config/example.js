

module.exports = {
    serialDevice: '/dev/ttyUSB0',
    mqtt: {
        server: 'mqtt.server.org',
        topic: 'infrastructure/smartmeter/house',
        options: {
            retain: true,
            qos: 1
        }
    }
};