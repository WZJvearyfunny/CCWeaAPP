// app.js
import request from '~/api/request';

App({
  onLaunch(options) {
    this.globalData.channelCode = options.query?.channelCode || 'default';
    const updateManager = wx.getUpdateManager();

    updateManager.onCheckForUpdate((res) => {
      // console.log(res.hasUpdate)
    });

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        },
      });
    });
    this.getUserInfo();
  },
  globalData: {
    userInfo: null,
    unreadNum: 0, // 未读消息数量
    socket: null, // SocketTask 对象
    channelCode: 'default'
  },

  getUserInfo(){
    const userInfo = wx.getStorageSync('user_info');
    const channelCode = this.globalData.channelCode;
    if(!userInfo?.openId){
      wx.login({
        async success (res) {
          if (res.code) {
            //发起网络请求
            console.log(res.code)
            try{
              const userRes = await request('/api/user/login', 'post', {
                code: res.code,
                channelCode
              });
              if(userRes){
                const { openid } = userRes?.data;
                wx.setStorage({
                  key:"user_info",
                  data: {
                    openId: openid
                  }
                })
              }
            }catch(err){
              console.log('err', err)
            }
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  }
});
