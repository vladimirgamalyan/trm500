
Vue.component('devices', {
    template: `
     <div>
       Devices
        <div v-for="item in privateState.data" :key="item.id">
            {{ item.type }}
        </div>
     </div>`,

    data: function () {
        return {
            privateState: {
                data: []
            },
            sharedState: store
        }
    },

    methods: {
        loadData: function () {
            console.log('load data');
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
        this.loadData();

        setInterval(function () {
            this.loadData();
        }.bind(this), 5000);
    },
    beforeDestroy() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = undefined
        }
    },
});
