
Vue.component('login', {
    template: `
     <div>
       <form class="login" @submit.prevent="login">
         <h1>Sign in</h1>
         <label for="username">User name</label>
         <input required id="username" v-model="privateState.username" type="text" />
         <label for="password">Password</label>
         <input required id="password" v-model="privateState.password" type="password" />
         <button type="submit">Login</button>
         <p>{{privateState.message}}</p>
       </form>
     </div>`,

    data: function () {
        return {
            privateState: {
                message: '',
                username: 'ruslan4688@ya.ru',
                password: 'scion065'
            },
            sharedState: store
        }
    },

    methods: {
        login: function () {
            let vm = this;

            vm.message = 'please wait';
            axios
                .request({
                    method: 'POST',
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'accept': '*/*'
                    },
                    url: '/v1/auth/open',
                    data: {
                        login: vm.privateState.username,
                        password: vm.privateState.password
                    }
                })
                .then(function (response) {
                    vm.privateState.message = response.data;
                    vm.sharedState.token = response.data.token;
                    vm.sharedState.authorized = true;
                })
                .catch(function (error) {
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        vm.privateState.message = error.response.data.message;
                    }
                })
        }
    }
});
