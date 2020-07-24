var store = {
    token: null,
    currentTemp: null
};

window.addEventListener('load', function () {
    new Vue({
        el: '#app',
        data: store,
        template: `
            <div>
                <term></term>
            </div>
        `
    });

    var client = mqtt.connect('wss://test.mosquitto.org:8081'); // you add a ws:// url here


    client.on('message', function (topic, payload) {
        //console.log(`  Topic: ${topic}`);
        //console.log(`  Payload: ${payload}`);
        if (topic === '/foo') {
            let t = JSON.parse(payload);
            //console.log(t);
            store.currentTemp = t.temp;
            console.log(store.currentTemp);
        }
        //client.end();
    });

    client.on('connect', function (connack) {
        client.subscribe('/foo');
        console.log('mqtt connect');
    });

    client.on('reconnect', function () {
        console.log('mqtt connect');
    });

    client.on('close', function () {
        console.log('mqtt close');
    });

    client.on('disconnect', function () {
        console.log('mqtt disconnect');
    });

    client.on('offline', function () {
        console.log('mqtt offline');
    });

    client.on('error', function () {
        console.log('mqtt error', error);
    });

    //client.publish('/foo', 'hello mqtt.js!');
});
