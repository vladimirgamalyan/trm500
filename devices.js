
Vue.component('devices', {
    template: `
     <div>
       Devices
        <div v-for="item in privateState.data" :key="item.id">
            {{ item.type }}
        </div>
        
        <button v-on:click="setTemp(20)">20</button>
        <button v-on:click="setTemp(30)">30</button>
        <button v-on:click="setDiscrete(0)">OFF</button>
        <button v-on:click="setDiscrete(1)">ON</button>
        <button v-on:click="loadDevices">Refresh</button>
                
        <div v-for="item in privateState.deviceData.parameters" :key="item.id">
            <pre>{{ item.id }}  {{ item.name }} {{ item.value }}</pre>
        </div>
        
        <div>
            <pre>{{ privateState.deviceData  }}</pre>
        </div>
     </div>`,

    data: function () {
        return {
            privateState: {
                data: [],
                deviceData: {foo: 42}
            },
            sharedState: store
        }
    },

    methods: {
        setDiscrete: function (value) {
            console.log('set setDiscrete', value);
            let vm = this;

            axios
                .request({
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Authorization': 'Bearer ' + vm.sharedState.token,
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    url: '/v1/parameters/write-data',
                    data: {
                        "timeout":60,
                        "sync":true,
                        "data":[
                            {
                                "id": 4369461,
                                "value": value.toString()
                            }
                        ]
                    }
                })
                .then(function (response) {
                    //vm.privateState.data = response.data;
                    console.log(response.data);
                    //vm.sharedState.authorized = true;

                    vm.loadDevices();
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        //vm.privateState.message = error.response.data.message;
                    }
                })
        },
        setTemp: function (temp) {
            console.log('set temp', temp);
            let vm = this;

            axios
                .request({
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Authorization': 'Bearer ' + vm.sharedState.token,
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    url: '/v1/parameters/write-data',
                    data: {
                        "timeout":60,
                        "sync":true,
                        "data":[
                            {
                                "id": 4369491,
                                "value": temp.toString()
                            }
                        ]
                    }
                })
                .then(function (response) {
                    //vm.privateState.data = response.data;
                    console.log(response.data);
                    //vm.sharedState.authorized = true;

                    vm.loadDevices();
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        //vm.privateState.message = error.response.data.message;
                    }
                })
        },
        loadDevices: function () {
            console.log('load devices');
            let vm = this;

            axios
                .request({
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Authorization': 'Bearer ' + vm.sharedState.token,
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    url: '/v1/device/index',
                    data: {

                    }
                })
                .then(function (response) {
                    vm.privateState.data = response.data;
                    console.log(response.data);
                    //vm.sharedState.authorized = true;

                    vm.loadDevice(response.data[0].id);
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        //vm.privateState.message = error.response.data.message;
                    }
                })
        },

        loadDevice: function (id) {
            console.log('load device');
            let vm = this;

            axios
                .request({
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'Authorization': 'Bearer ' + vm.sharedState.token,
                        'content-type': 'application/x-www-form-urlencoded',
                    },
                    url: '/v1/device/' + id,
                    data: []
                })
                .then(function (response) {
                    vm.privateState.deviceData = response.data;
                    console.log(response.data);
                    //vm.sharedState.authorized = true;
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        //vm.privateState.message = error.response.data.message;
                    }
                })
        }
    },

    created: function () {
        console.log('devices ready');
        this.loadDevices();

        // setInterval(function () {
        //     this.loadData();
        // }.bind(this), 5000);
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined
        }
    },
});
