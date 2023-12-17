import axios from 'axios';
import user_localMemory from '../3_LocalMemory/User_localMemory';

function createInterceptors(): void {

    axios.interceptors.request.use(function (config) {
        
        const token = user_localMemory.token;
        if (token) {
            config.headers['authorization'] = "Bearer " + token;
        }

        return config;

        // https://github.com/svrcekmichal/redux-axios-middleware/issues/83
        // if u add new Chainable promise or other interceptor
        // You have to return `config` inside of a rquest
        // otherwise u will get a very confusing error
        // and spend sometime to debug it.
    }, function (error) {
        return Promise.reject(error);
    });

}

export default createInterceptors;