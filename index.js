const mqtt = require('mqtt');
const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`)
const client  = mqtt.connect('mqtt://broker.hivemq.com')

client.on('connect', function () {
    client.subscribe('linebot/tarnburi', function (err) {})
})

client.on('message', function (topic, message) {
    console.log("Node: " + message.toString())
    var spawn = require("child_process").spawn;
    var process = spawn('python', ["save_img.py", message.toString()])

    process.stdout.on(
        'data',
        logOutput('stdout')
      );
    process.stderr.on(
        'data',
        logOutput('stderr')
      );
})