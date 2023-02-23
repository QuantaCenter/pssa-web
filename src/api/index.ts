import axios from 'axios'
import qs from 'qs'

const instance = axios.create({
    baseURL: process.env.NODE_ENV==="development"? '/api' :'https://pssa.quantacenter.com',
    timeout: 3000,
    // headers: {
    //      'Content-Type': 'application/json'
    // }
})
//console.log(process.env.NODE_ENV)
//development
function awaitGap(promise: any) {
    return promise.then((res: any) => {
        return [null, res]
    }).catch((err: any) => {
        return [err, null]
    })
}

export default {
    post: function (url: string, data: any, config={}) {
        return awaitGap(instance.post(url, qs.stringify(data), config))
    },
    get: function (url: string) {
        return awaitGap(instance.get(url))
    },
    // awaitGap: awaitGap
}