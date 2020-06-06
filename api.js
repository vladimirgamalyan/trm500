var api = {

    req: function (url, data) {
        let headers = {
            'content-type': 'application/x-www-form-urlencoded',
            'accept': '*/*'
        };
        if (store.token) {
            headers['Authorization'] = 'Bearer ' + store.token
        }
        return axios
            .request({
                method: 'POST',
                headers,
                url,
                data
            });
        //TODO: сбрасывать авторизацию если пришл 401
    },

    open: function (login, password) {
        return this.req('/v1/auth/open', {
            login,
            password
        });
    },

    loadDevices: function () {
        return this.req('/v1/device/index', {});
    },

    loadDevice: function (id) {
        return this.req('/v1/device/' + id, []);
    },

    writeDataBulk: function (data) {
        console.log('writeDataBulk', data);
        return this.req('/v1/parameters/write-data', {
            "timeout": 60,
            "sync": true,
            "data": data
        });
    },

    writeData: function (id, value) {
        return this.writeDataBulk([{id, value}])
    }
};
