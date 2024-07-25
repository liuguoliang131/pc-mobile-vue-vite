import axios from 'axios'
import md5 from 'js-md5'
const onlykey = 'eSLMVFEGNxg7Jgw5TMqREDdeCHiw4aT8ipuqlNCkdO04550='

const instance = axios.create({
  baseURL: import.meta.env.VITE_REQUEST_URL,
  timeout: 20000,
  headers: {
    token: '',
    sign: ''
  }
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  console.log('config', config)
  // 在发送请求之前做些什么

  const ts = Date.now()
  config.headers.ts = ts
  let data = {}
  if (config.method === 'get') {
    data = config.params || {}
  } else if (config.method === 'post') {
    data = config.data || {}
  }
  const attrList = []
  Object.keys(data).sort().forEach((key, idx) => {
    attrList[idx] = key + '=' + data[key]
  })
  const afterUrl = attrList.join('&') // 参数串
  // console.log('sort', afterUrl)
  // console.log(afterUrl + '&ak=' + onlykey + '&ts=' + ts)
  const sign = md5(afterUrl + '&ts=' + ts + onlykey)
  console.log('sign:', sign)
  config.headers.sign = sign
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  console.log('response', response)
  // if (response.data.code !== 0) {

  // }
  // 对响应数据做点什么
  return response.data
}, function (error) {
  console.log('axios error:', error)
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
