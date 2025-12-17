import request from '~/api/request';
import useToastBehavior from '~/behaviors/useToast';

Page({
  behaviors: [useToastBehavior],

  data: {
    isLoad: false,
    service: [],
    gridList: [
      {
        name: '全部发布',
        icon: 'root-list',
        type: 'all',
        url: '',
      },
      {
        name: '审核中',
        icon: 'search',
        type: 'progress',
        url: '',
      },
      {
        name: '已发布',
        icon: 'upload',
        type: 'published',
        url: '',
      },
      {
        name: '草稿箱',
        icon: 'file-copy',
        type: 'draft',
        url: '',
      },
    ],

    settingList: [
      { name: '联系客服', icon: 'service', type: 'service' },
      // { name: '设置', icon: 'setting', type: 'setting', url: '/pages/setting/index' },
    ],
    phoneNumber: '',
    openId: '',
    schoolName: '',
    studentName: '',
    visible: false,
  },

  onLoad() {
    this.init();
  },

  async onShow() {

  },
  init(){
    const {phoneNumber = ''} = wx.getStorageSync('user_phone')
    if(phoneNumber){
      this.setData({
        isLoad: true,
        phoneNumber,
      })
    }else{
      this.setData({
        isLoad: false,
      })
    }
  },
  getUserInfo(){
    const scope = this;
    return new Promise((res)=>{
      const userInfo = wx.getStorageSync('user_info');
      if(!userInfo?.openId){
        wx.login({
          async success (res) {
            if (res.code) {
              //发起网络请求
              console.log(res.code)
              try{
                const userRes = await request('/api/user/login', 'post', {
                  code: res.code,
                  channelCode: app.globalData.channelCode
                });
                if(userRes){
                  const { openid } = userRes?.data;
                  wx.setStorage({
                    key:"user_info",
                    data: {
                      openId: openid
                    }
                  })
                  scope.setData({
                    openId: openid
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
    })
  },
  async getPhoneNumber(event){
    let { openId } = this.data;
    if(!openId){
      const userInfo = wx.getStorageSync('user_info');
      this.setData({
        openId: userInfo?.openId
      })
      openId = userInfo?.openId || ''
    }
    if(!openId){
      await this.getUserInfo();
      openId = this.data.openId
    }
    if(event.detail?.code){
      const phoneRes = await request('/api/user/getPhoneNumber', 'post', {
        openId,
        code: event.detail.code
      });
      if(phoneRes?.data?.phoneNumber){
        wx.setStorage({
          key:"user_phone",
          data: {
            phoneNumber: phoneRes.data.phoneNumber
          }
        })
        this.setData({
          phoneNumber: phoneRes.data.phoneNumber
        })
      }
      console.log('phoneRes',phoneRes)
    }
  },
  async checkInfo(){
    const { name, school, remark, openId } = this.data;
    console.log(name, school, remark)
    if(!name || !school){
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '请完善输入内容',
      });
      return;
    }
    try{
      const consultRes = await request('/api/message/consulting', 'post', {
        openId,
        schoolName: school,
        studentName: name,
        message: remark,
        channelCode: app.globalData.channelCode
      });
      const { data } = consultRes;
      if(data){
        this.closePop();
        wx.setStorageSync('isenter_userinfo', true)
        this.setData({
          schoolName,
          studentName,
        })
      }else{
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '提交失败，请检查网络后重试',
        });
      }
    }catch(err){
      console.log('err', err)
    }
  },
  onShareAppMessage(){
    return {
      title: '成才提招', 
      path: '/pages/home/index', 
    }
  },
  onShareTimeline(){
    return {
      title: '成才提招',
    }
  },
  onAddToFavorites(){
    return {
      title: '成才提招',
    }
  }
});
