
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
    created: function () {
        let vm = this;
        api.loadDevices()
            .then(function (response) {
                vm.privateState.devices = _.chain(response.data)
                    .filter(i => i.name.startsWith('test'))
                    .map(i => _.pick(i, ['id', 'type', 'name']))
                    .value();
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.status, error.response.data);
                }
            })
    }
});
