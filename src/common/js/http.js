import axios from 'axios'
import config from './config'
import { Notification } from 'element-ui';
import JSONbig from 'json-bigint';
import store from "./store";

// config中定义的基础路径是：http://api.leyou.com/api
axios.defaults.baseURL = config.api; // 设置axios的基础请求路径
axios.defaults.timeout = 2000; // 设置axios的请求时间
axios.defaults.headers.common['Authorization'] = store.state.token;
axios.defaults.transformResponse = function(data){
  let parse = JSONbig.parse(data);
  return parse;
}

// request拦截器
axios.interceptors.request.use(
  config => {

    // 根据条件加入token-安全携带
    if(store.state.token){
      config.headers.common['Authorization'] = store.state.token;
    }
    return config;
  },
  error => {
    // 请求错误处理
    return Promise.reject(error);
  }
)

/*
 *  get请求
 *  url:请求地址
 *  params:参数
 * */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'get',
      params: params,
    }).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}


/*
 *  post请求
 *  url:请求地址
 *  params:参数
 * */
export function post(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      data: params
    }).then(response => {
      if(response.code === "200"){
        Notification.success("成功");
      }
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/*
 *  put请求
 *  url:请求地址
 *  params:参数
 * */
export function put(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'put',
      data: params
    }).then(response => {
      if(response.code === "200"){
        Notification.success("修改成功");
      }
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}
/*
 *  delete请求
 *  url:请求地址
 *  params:参数
 * */
export function del(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'delete',
      data: params
    }).then(response => {
      if(response.code === "200"){
        Notification.success("删除成功");
      }
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

/*
 *  文件上传
 *  url:请求地址
 *  params:参数
 * */
export function fileUpload(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios({
      url: url,
      method: 'post',
      data: params,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      if(response.code === "200"){
        Notification.success("上传文件成功");
      }
      resolve(response);
    }).catch(error => {
      reject(error);
    });
  });
}

// respone拦截器
axios.interceptors.response.use(
  response => {
    // 统一处理状态
    const res = response.data;
    if (res.code === '401' || res.code === '500' || res.code === '400') { // 需自定义
      // 返回异常
      Notification.error(res.message);
    }
    return response.data;
  },
  // 处理处理
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          Notification.error("错误请求");
          break;
        case 401:
          Notification.error('未授权，请重新登录');
          break;
        case 403:
          Notification.error('拒绝访问');
          break;
        case 404:
          Notification.error('请求错误,未找到该资源');
          break;
        case 405:
          Notification.error('请求方法未允许');
          break;
        case 408:
          Notification.error('请求超时');
          break;
        case 500:
          Notification.error('服务器端出错');
          break;
        case 501:
          Notification.error('网络未实现');
          break;
        case 502:
          Notification.error('网络错误');
          break;
        case 503:
          Notification.error('服务不可用');
          break;
        case 504:
          Notification.error('网络超时');
          break;
        case 505:
          Notification.error('http版本不支持该请求');
          break;
        default:
          Notification.error(`未知错误${error.response.status}`);
      }
    } else {
      Notification.error("连接到服务器失败");
    }
    return Promise.reject(error);
  }
)


export default {
  get,
  post,
  put,
  del,
  fileUpload
}






