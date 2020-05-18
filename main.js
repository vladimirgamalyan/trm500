var store = {
    authorized: false,
    token: ''
};

window.addEventListener('load', function () {

    axios.defaults.baseURL = 'https://api.owencloud.ru';

    new Vue({
        el: '#app',
        data: store,
        template: `
            <div>
                <div v-if="authorized">
                  <devices></devices>
                </div>
                <div v-else>
                  <login></login>
                </div>
            </div>
        `
    });
});
