
Vue.component('oven', {
    template: `
    <div class="column">
        <div class="box">
            <h3 class="title">{{ data.name }} ({{data.type}})</h3>
            <p>Текущая температура {{getParam('Текущее значение')}}</p>
            <p>Уставка 1 {{getParam('Уставка 1')}}</p>
            <p>Уставка 2 {{getParam('Уставка 2')}}</p>
            <br>
            <div class="buttons">
                <button v-for="item in getPrograms()" class="button is-large" v-on:click="setMode(item)">{{item.name}}</button>
                <button class="button is-large" v-on:click="cancelMode()">Отмена</button>
            </div>                
        </div>
    </div>`,

    data: function () {
        return {
            sharedState: store,
            privateState: {
                deviceData: null,
                currentTemperature: null,
                parameters: {},
                set1: null,
                set2: null
            }
        }
    },

    props: ['data'],

    methods: {

        getPrograms: function () {
            return programs;
        },

        updateData: function () {
            let vm = this;
            api.loadDevice(vm.data.id)
                .then(function (response) {
                    vm.privateState.deviceData = response.data;
                });
        },

        getParam: function (name) {
            if (this.privateState.deviceData && this.privateState.deviceData.parameters)
            {
                return _.chain(this.privateState.deviceData.parameters)
                    .filter(i => i.name === name)
                    .value()[0].value;
            }
            return '-';
        },

        setParam: function (name, value) {
            let vm = this;
            var id = _.chain(this.privateState.deviceData.parameters)
                .filter(i => i.name === name)
                .value()[0].id;
            api.writeData(id, value).then( function () {
                vm.updateData();
            });
        },

        setMode: function (mode) {
            console.log(mode);
            this.setParam('Уставка 2', mode.temp.toString());
        },

        cancelMode: function () {
            console.log('cancel');
        }
    },

    created: function () {
        this.updateData();
    }
});
