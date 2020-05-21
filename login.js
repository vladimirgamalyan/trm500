
Vue.component('login', {
    template: `
     <section class="hero is-fullheight is-light">
        <div class="hero-body">
            <div class="container">
            
            <div class="columns is-centered">
            <div class="column is-5-tablet is-4-desktop is-3-widescreen">
            
               <form class="box" @submit.prevent="login">
                 <h1 class="title">Sign in</h1>
                 
                 <div class="field">
                    <label class="label" for="username">User name</label>
                    <div class="control">
                        <input v-bind:disabled="privateState.loading" class="input" required id="username" v-model="privateState.username" type="text" />
                    </div>
                 </div>
                 
                 <div class="field">
                    <label class="label" for="password">Password</label>
                    <div class="control">
                        <input v-bind:disabled="privateState.loading" class="input" required id="password" v-model="privateState.password" type="password" />
                    </div>
                 </div>
                          
                 <p class="content ">{{privateState.message}}</p>
                 
                 <button v-bind:disabled="privateState.loading" class="button is-info is-fullwidth" v-bind:class="{'is-loading': privateState.loading}" type="submit">Login</button>
                 
                 
        
               </form>
               
               </div>
               </div>
               
           </div>
       </div>
     </section>`,

    data: function () {
        return {
            privateState: {
                message: '',
                username: 'ruslan4688@ya.ru',
                password: 'scion065',
                loading: false
            },
            sharedState: store
        }
    },

    methods: {
        login: function () {
            let vm = this;
            vm.privateState.loading = true;

            api.open(vm.privateState.username, vm.privateState.password)
                .then(function (response) {
                    vm.privateState.loading = false;
                    vm.sharedState.token = response.data.token;
                })
                .catch(function (error) {
                    vm.privateState.loading = false;
                    vm.sharedState.token = null;
                    if (error.response) {
                        console.log(error.response.data);
                        console.log(error.response.status);
                        vm.privateState.message = error.response.data.message;
                    }
                })
        }
    }
});
