import axios from 'axios';
import qs from 'qs';
const instance = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? '/api' : 'https://pssa.quantacenter.com',
    timeout: 3000,
});
//console.log(process.env.NODE_ENV)
//development
function awaitGap(promise) {
    return promise.then((res) => {
        return [null, res];
    }).catch((err) => {
        return [err, null];
    });
}
export default {
    post: function (url, data, config = {}) {
        return awaitGap(instance.post(url, qs.stringify(data), config));
    },
    get: function (url) {
        return awaitGap(instance.get(url));
    },
};
//# sourceMappingURL=index.js.map