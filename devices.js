
Vue.component('devices', {
    template: `
        <div>
            <div class="section">   
                <div class="columns">
                    <oven v-for="item in privateState.devices" :key="item.id" v-bind:data="item"></oven>
                </div>
            </div>
         </div>`,

    data: function () {
        return {
            privateState: {
                data: [],
                deviceData: {foo: 42},
                devices: []
            },
            sharedState: store
        }
    },

    methods: {
        setDiscrete: function (value) {
            console.log('set setDiscrete', value);
            let vm = this;

            api.setDiscrete(value)
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

            api.setTemp(temp)
                .then(function (response) {
                    console.log(response.data);
                    vm.loadDevices();
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                    }
                })
        },
        loadDevices: function () {
            console.log('load devices');
            let vm = this;

            api.loadDevices()
                .then(function (response) {
                    vm.privateState.data = response.data;
                    vm.loadDevice(response.data[0].id);
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                    }
                })
        },

        loadDevice: function (id) {
            console.log('load device');
            let vm = this;

            return api.loadDevice(id)
                .then(function (response) {
                    vm.privateState.deviceData = response.data;
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                    }
                })
        }
    },

    created: function () {
        this.loadDevices();

        let vm = this;

        api.loadDevices()
            .then(function (response) {
                console.log(response.data);
                vm.privateState.devices = _.chain(response.data)
                    .filter(i => i.name.startsWith('test'))
                    .map(i => _.pick(i, ['id', 'type', 'name']))
                    .value();
                //vm.privateState.devices.push(vm.privateState.devices[0]);
                //vm.privateState.devices.push(vm.privateState.devices[0]);
                // vm.privateState.devices.push(vm.privateState.devices[0]);
                // vm.privateState.devices.push(vm.privateState.devices[0]);
                // vm.privateState.devices.push(vm.privateState.devices[0]);
                // vm.privateState.devices.push(vm.privateState.devices[0]);
                // vm.privateState.devices.push(vm.privateState.devices[0]);
                // vm.privateState.devices.push(vm.privateState.devices[0]);


                console.log(vm.privateState.devices);
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.status, error.response.data);
                }
            })

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
