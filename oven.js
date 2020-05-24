
Vue.component('oven', {
    template: `
    <div class="column">
        <div class="box">
            <h3 class="title">{{ data.name }} ({{data.type}})</h3>
            <p>Текущая температура {{getParam('Текущее значение')}}</p>
            <p>Уставка 1 {{getParam('Уставка 1')}}</p>
            <p>Уставка 2 {{getParam('Уставка 2')}}</p>
            <br>
            <p>Режим {{getCurrMode().name}}</p>
            <p>Температура {{getCurrMode().temp}}</p>
            <p>Время {{getTimeString(getCurrMode().time)}}</p>
            <br>
            <p>Таймер {{getTimer()}}</p>
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
                set2: null,
                timerAlarmTime: 0,
                timerCurrent: 0,
                currMode: null
            }
        }
    },

    props: ['data'],

    methods: {

        getTimeString(t) {
            if (!_.isFinite(t)) {
                return '-';
            }
            var minutes, seconds;
            minutes = (t / 60) | 0;
            seconds = (t % 60) | 0;

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            return '' + minutes + ':' + seconds;
        },

        getCurrMode: function () {
            var program = _.find(programs, {name:this.privateState.currMode});
            if (program) {
                return program;
            } else {
                return {
                    'name': '-',
                    'temp': '-',
                    'time': '-',
                };
            }
        },

        getTimer: function () {
            return this.getTimeString(this.privateState.timerCurrent);
        },

        getPrograms: function () {
            return programs;
        },

        onTimer: function () {
            if (this.privateState.timerAlarmTime > 0) {
                var elapsed = this.privateState.timerAlarmTime - Date.now();
                if (elapsed <= 0) {
                    this.privateState.timerAlarmTime = 0;
                    this.privateState.timerCurrent = 0;
                    this.privateState.setTemp = 0;
                    console.log("finish timer");
                } else {
                    this.privateState.timerCurrent = Math.round( elapsed / 1000);
                }
            }
        },

        startTimer: function (t) {
            this.privateState.timerAlarmTime =  Date.now() + t * 1000;
            this.onTimer();
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
            //this.setParam('Уставка 2', mode.temp.toString());
            this.startTimer(mode.time);
            this.privateState.currMode = mode.name;
        },

        cancelMode: function () {
            console.log('cancel');
            this.privateState.timerAlarmTime = 0;
            this.privateState.timerCurrent = 0;
            this.privateState.currMode = null;
        }
    },

    created: function () {
        this.updateData();
        this.cancelMode();
        setInterval(this.onTimer, 100);
    }
});
