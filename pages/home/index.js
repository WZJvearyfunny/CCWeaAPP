import request from '~/api/request';
import Message from 'tdesign-miniprogram/message/index';

// 获取应用实例
const app = getApp();
const imageCdn = 'https://www.zjccjy.com';
const swiperList = [
  `${imageCdn}/banner11.jpg`,
  `${imageCdn}/banner12.jpg`,
  `${imageCdn}/banner13.jpg`,
  `${imageCdn}/banner14.jpg`,
  `${imageCdn}/banner15.jpg`,
];
const SUBJECT_MAP = new Map([[
  'yuwen', '语文',
  ],[
    'shuxue', '数学',
  ],[
    'yingwen', '外语',
  ],[
    'zhengzhi', '政治',
  ],[
    'lishi', '历史',
  ],[
    'dili', '地理',
  ],[
    'wuli', '物理',
  ],[
    'huaxue', '化学',
  ],[
    'shengwu', '生物',
  ],[
    'jishu', '技术',
  ]]);

Page({
  data: {
    current: 0,
    swiperList,
    phoneNumber: '',
    openId: '',
    gradeArr: ['A','B','C','D','E'],
    subjectArr: [
      {
        sub: '语文',
        subject: "yuwen",
        grade: ''
      },{
        sub: '数学',
        subject: "shuxue",
        grade: ''
      },{
        sub: '外语',
        subject: "yingwen",
        grade: ''
      },{
        sub: '政治',
        subject: "zhengzhi",
        grade: ''
      },{
        sub: '历史',
        subject: "lishi",
        grade: ''
      },{
        sub: '地理',
        subject: "dili",
        grade: ''
      },{
        sub: '物理',
        subject: "wuli",
        grade: ''
      },{
        sub: '化学',
        subject: "huaxue",
        grade: ''
      },{
        sub: '生物',
        subject: "shengwu",
        grade: ''
      },{
        sub: '技术',
        subject: "jishu",
        grade: ''
      },
    ],
    visible: false,
    name: '',
    school: '',
    remark: '',
    historyVisible: false,
    history: [],
  },
  _isShowInfo: false,
  // 生命周期
  async onReady() {
    
  },
  onLoad(option) {
    const phoneNumber = wx.getStorageSync('user_phone');
    const userInfo = wx.getStorageSync('user_info');
    const { openId } = userInfo;
    this.setData({
      phoneNumber,
      openId
    })
  },
  clickGrade(event){
    const { findex, grade } = event?.currentTarget?.dataset;
    const subjectArr = this.data.subjectArr;
    subjectArr[findex].grade = grade
    this.setData({
      subjectArr
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
        this.searchGrade();
      }
      console.log('phoneRes',phoneRes)
    }
  },
  async searchGrade(){
    if(!this._isShowInfo){
      const isenterUserinfo = wx.getStorageSync('isenter_userinfo');
      if(!isenterUserinfo){
        this.setData({
          visible: true
        })
        this._isShowInfo = true;
        return;
      }
    }
    this._isShowInfo = false;
    const { subjectArr, openId } = this.data;
    const scoreList = subjectArr.filter(e=> e.grade).map((item)=>{
      return {
        subject: item.subject,
        grade: item.grade
      }
    })
    if(scoreList.length !== 10){
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '请输入完整得分，无分科目选择E',
      });
      return;
    }
    wx.showLoading();
    try{
      const gradeRes = await request('/api/user/queryScores', 'post', {
        openId,
        scoreList,
        isHistory: false
      });
      console.log('gradeRes', gradeRes)
      if(gradeRes && gradeRes?.data){
        app.globalData.schoolList = gradeRes?.data;
        app.globalData.scoreList = scoreList;
        wx.navigateTo({
          url: '/pages/schoolList/index',
        });
      }else{
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '查询失败，请检查网络后重试',
        });
      }
    }catch(err){
      console.log('err', err)
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '查询失败，请检查网络后重试',
      });
    }
    wx.hideLoading();
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
  closePop(){
    this.setData({
      visible: false
    })
    Message.info({
      context: this,
      offset: [90, 32],
      duration: 5000,
      content: '填写完整信息，可以帮助您更准确查询志愿',
    });
    this.searchGrade();
  },
  editName(e){
    this.setData({
      name: e.detail.value,
    });
  },
  editSchool(e){
    this.setData({
      school: e.detail.value,
    });
  },
  editRemark(e){
    this.setData({
      remark: e.detail.value,
    });
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
        message: remark
      });
      const { data } = consultRes;
      if(data){
        this.setData({
          visible: false
        })
        wx.setStorageSync('isenter_userinfo', true)
        this.searchGrade();
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
  async searchHistory(){
    const { openId } = this.data;
    if(!openId) {
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '请先查询',
      });
      return;
    }
    wx.showLoading();
    try{
      const historyRes = await request('/api/user/history', 'get', {
        openId,
      });
      let historyPoList = historyRes?.data?.historyPoList || [];
      if(historyRes && historyPoList?.length){
        historyPoList = historyPoList.map(item=>{
          let searchKey = JSON.parse(item.searchKey);
          let subAndGrade = '';
          searchKey.forEach(itemK => {
            subAndGrade = `${subAndGrade}${SUBJECT_MAP.get(itemK.subject)}:${itemK.grade}; `;
          });
          return {
            ...item,
            subAndGrade,
          };
        });
        console.log('historyPoList', historyPoList)
        this.setData({
          historyPoList
        })
        this.showHistoryVisible();
      }else{
        Message.info({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '请先查询',
        });
      }
    }catch(err){
      Message.info({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '网络异常，请先检查网络后重试',
      });
    }
    wx.hideLoading();
  },
  onVisibleChange(event){
    const visible = event?.detail?.visible;
    this.setData({
      visible
    })
  },
  showHistoryVisible(){
    this.setData({
      historyVisible: true
    })
  },
  onHistoryVisibleChange(event){
    const visible = event?.detail?.visible;
    this.setData({
      historyVisible: visible
    })
  },
  async historyHandel(event){
    const { openId } = this.data;
    const { item } = event.currentTarget.dataset
    const searchKey = JSON.parse(item.searchKey);
    wx.showLoading();
    try{
      const gradeRes = await request('/api/user/queryScores', 'post', {
        openId,
        scoreList: searchKey,
        isHistory: true
      });
      console.log('gradeRes', gradeRes)
      if(gradeRes && gradeRes?.data){
        app.globalData.scoreList = searchKey;
        app.globalData.schoolList = gradeRes?.data;
        wx.navigateTo({
          url: '/pages/schoolList/index',
        });
      }else{
        Message.error({
          context: this,
          offset: [90, 32],
          duration: 2000,
          content: '查询失败，请检查网络后重试',
        });
      }
    }catch(err){
      console.log('err', err)
      Message.error({
        context: this,
        offset: [90, 32],
        duration: 2000,
        content: '查询失败，请检查网络后重试',
      });
    }
    wx.hideLoading();
  }
});
