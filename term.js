
Vue.component('term', {
    template: `
        <div>
            <div class="section">   
                <div class="columns">
                    <div class="column">
                        <div class="box">
                            <p>Текущая температура {{ sharedState.currentTemp }}</p>
                        </div>
                    </div>
                </div>
            </div>
         </div>
    `,

    data: function () {
        return {
            sharedState: store
        }
    },

    created() {
        //setInterval(this.getNow, 1000);
    },

    methods: {

    }
});
