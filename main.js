var store = {
    token: null
};

window.addEventListener('load', function () {

    axios.defaults.baseURL = 'https://api.owencloud.ru';

    new Vue({
        el: '#app',
        data: store,
        template: `
            <div>
                <div v-if="token">
                  <devices></devices>
                </div>
                <div v-else>
                  <login></login>
                </div>
            </div>
        `
    });
});
