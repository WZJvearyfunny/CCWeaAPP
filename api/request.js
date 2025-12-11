import config from '~/config';

const { baseUrl } = config;
function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      header: {
        'content-type': 'application/json' // 默认值
      },
      method,
      data,
      dataType: 'json',
      timeout: 5000,
      success (res) {
        if (res.statusCode === 200) {
          resolve(res?.data);
        } else {
          reject(res);
        }
      },
      fail(err) {
        reject(err);
      },
    })
  });
}

// 导出请求和服务地址
export default request;
