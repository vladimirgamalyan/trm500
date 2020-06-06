
Vue.component('oven', {
    template: `
    <div class="column">
        <div class="box">
            <h3 class="title">{{ data.name }}</h3>
            <p>Текущая температура {{getParam('Текущее значение')}}</p>
            <p>Уставка 1 {{getParam('Уставка 1')}}</p>
            <p>Нижний порог {{getParam('Нижний порог сигнализации')}}</p>
            <p>Дискретный вход {{getParam('Текущее состояние дискретного входа')}}</p>
            <br>
            <p>Режим {{getCurrMode().name}}</p>
            <p>Температура {{getCurrMode().temp}}</p>
            <p>Время {{getTimeString(getCurrMode().time)}}</p>
            <br>
            <p>Таймер {{getTimer()}}</p>
            <p>Состояние: {{getStateString()}}</p>
            <br>
            <div class="buttons">
                <button v-for="item in getPrograms()" 
                    :disabled="!getProgramButtonsEnabled()"
                    class="button is-large"
                    v-on:click="setMode(item)">{{item.name}}</button>
                <button class="button is-large" v-on:click="cancelMode()" :disabled="!getCancelButtonsEnabled()">Отмена</button>
            </div>                
        </div>
    </div>`,

    data: function () {
        return {
            sharedState: store,
            privateState: {
                state: null,
                needToDisableAlarm: false,
                disableAlarmStartTime: 0,
                deviceData: null,
                currentTemperature: null,
                parameters: {},
                set1: null,
                set2: null,
                timerAlarmTime: 0,
                timerValue: 0,
                currMode: null,
                updateInProgress: false,
                buttonEnabled: {
                    programButtons: false,
                    cancelButton: false
                }
            }
        }
    },

    props: ['data'],

    methods: {
        disableAllButtons: function () {
            this.privateState.buttonEnabled.programButtons = false;
            this.privateState.buttonEnabled.cancelButton = false;
        },
        getProgramButtonsEnabled: function () {
            return this.privateState.buttonEnabled.programButtons;
        },
        getCancelButtonsEnabled: function () {
            return this.privateState.buttonEnabled.cancelButton;
        },
        getStateString: function () {
            var vm = this;
            var dict = {
                'wait': '...',
                'preload': 'Загрузка',
                'ready': 'Готов к работе',
                'preheat': 'Разгорев',
                'work': 'Работа'
            };
            if (!dict.hasOwnProperty(vm.privateState.state)) {
                throw 'unknown state: ' + vm.privateState.state;
            }
            return dict[vm.privateState.state];
        },

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

        updateTimerValue: function () {
            var vm = this;
            var timerCurrent = 0;
            if (vm.privateState.timerAlarmTime > 0) {
                var remain = vm.privateState.timerAlarmTime - Date.now();
                if (remain > 0) {
                    timerCurrent = Math.round(remain / 1000);
                }
            }
            if (vm.privateState.timerValue !== timerCurrent) {
                vm.privateState.timerValue = timerCurrent;
            }
        },

        getTimer: function () {
            var vm = this;
            if (vm.privateState.state === 'work') {
                return vm.getTimeString(vm.privateState.timerValue);
            }
            // if (vm.privateState.state === 'ready') {
            //     return vm.getTimeString(0);
            // }
            return '--:--';
        },

        getPrograms: function () {
            return programs;
        },

        updateData: function () {
            let vm = this;
            return api.loadDevice(vm.data.id)
                .then(function (response) {
                    //console.log(response.data);
                    //let params = response.data.parameters;
                    //console.log(_.map(params, 'name'));
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
            return api.writeData(id, value);
        },

        setParamBulk: function (data) {
            var vm = this;
            var d = _.map(data, function (item) {
                var id = _.chain(vm.privateState.deviceData.parameters)
                    .filter(i => i.name === item.name)
                    .value()[0].id;
                return { id, value: item.value }
            });
            return api.writeDataBulk(d);
        },

        reloadData: function () {
            var vm = this;
            vm.updateData().then(function () {
                setTimeout(vm.reloadData, 3000);
            });
        },

        setMode: function (mode) {
            var vm = this;
            if (vm.privateState.state === 'ready') {
                vm.privateState.state = 'wait';
                vm.disableAllButtons();
                this.privateState.buttonEnabled.cancelButton = true;
                vm.privateState.currMode = mode.name;
                var d = [{
                    name: 'Уставка 1',
                    value: mode.temp.toString()
                }, {
                    name: 'Нижний порог сигнализации',
                    value: '0'
                }];
                vm.setParamBulk(d).then(function () {
                    vm.privateState.state = 'preheat';
                    vm.updateData();
                });
            }
        },

        cancelMode: function () {
            var vm = this;
            if (vm.privateState.state === 'preheat' || vm.privateState.state === 'work') {
                vm.privateState.timerAlarmTime = 0;
                vm.disableAllButtons();
                vm.privateState.state = 'wait';
                var d = [{
                    name: 'Нижний порог сигнализации',
                    value: '0'
                }];
                vm.setParamBulk(d).then(function () {
                    vm.privateState.buttonEnabled.programButtons = true;
                    vm.privateState.state = 'ready';
                    vm.privateState.currMode = null;
                    vm.privateState.needToDisableAlarm = false;
                })
            }
        },

        update: function () {
            var vm = this;
            var stateLogic = {
                'wait': function () {},
                'preload': function () {
                    vm.privateState.state = 'wait';
                    vm.updateData().then(function () {
                        vm.privateState.buttonEnabled.programButtons = true;
                        vm.privateState.state = 'ready';
                    });
                },
                'ready': function () {
                    if (vm.privateState.needToDisableAlarm) {
                        if (((vm.privateState.disableAlarmStartTime + 30000) < Date.now()) || (vm.getParam('Текущее состояние дискретного входа') === '0')) {
                            vm.privateState.needToDisableAlarm = false;
                            var d = [{
                                name: 'Нижний порог сигнализации',
                                value: '0'
                            }];
                            //TODO: error
                            vm.setParamBulk(d);
                        }
                    }
                },
                'preheat': function () {
                    if (vm.getParam('Текущее состояние дискретного входа') === '1') {
                        var temp = parseFloat(vm.getParam('Текущее значение'));
                        if (!isNaN(temp)) {
                            //TODO: getCurrMode can return '-'
                            if (temp + 5 >= vm.getCurrMode().temp) {
                                vm.privateState.state = 'work';
                                //TODO: getCurrMode can return '-'
                                vm.privateState.timerAlarmTime =  Date.now() + vm.getCurrMode().time * 1000;
                            }
                        }
                    }
                },
                'work': function () {
                    var remain = vm.privateState.timerAlarmTime - Date.now();
                    if (remain <= 0) {
                        vm.privateState.timerAlarmTime = 0;
                        vm.disableAllButtons();
                        vm.privateState.state = 'wait';
                        var d = [{
                            name: 'Нижний порог сигнализации',
                            value: '500'
                        }];
                        vm.setParamBulk(d).then(function () {
                            vm.privateState.buttonEnabled.programButtons = true;
                            vm.privateState.state = 'ready';
                            vm.privateState.needToDisableAlarm = true;
                            vm.privateState.disableAlarmStartTime = Date.now();
                        })
                    }
                }
            };
            if (!stateLogic.hasOwnProperty(vm.privateState.state)) {
                throw 'unknown state: ' + vm.privateState.state;
            }
            stateLogic[vm.privateState.state]();
            vm.updateTimerValue();
            setTimeout(this.update, 100);
        }
    },

    created: function () {
        var vm = this;
        vm.disableAllButtons();
        vm.privateState.state = 'preload';
        setTimeout(vm.update, 100);
        setTimeout(vm.reloadData, 3000);
    }
});
