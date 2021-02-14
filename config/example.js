

module.exports = {
    serialDevice: '/dev/smartmeter/n',
    mqtt: {
        server: 'mqtt.server.org',
        topic: 'infrastructure/smartmeter/house',
        options: {
            retain: true,
            qos: 1
        }
    }
};