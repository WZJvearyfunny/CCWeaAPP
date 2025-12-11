import request from '~/api/request';
import Message from 'tdesign-miniprogram/message/index';

const app = getApp();
Page({
  data: {
    detailRes: []
  },
  _schoolId: '',
  _schoolName: '',
  _score: 0,
  onLoad(option) {
    this._schoolId = option.schoolId;
    this._schoolName = option.schoolName;
    // this._score = option.score ? +option.score : 0;
    wx.setNavigationBarTitle({
      title: this._schoolName || '成才教育'
    })
    this.searchSchoolDetail();
  },
  async searchSchoolDetail(){
    wx.showLoading();
    const userInfo = wx.getStorageSync('user_info');
    const { openId } = userInfo;
    try{
      const detailRes = await request('/api/school/querySchoolMajorScore', 'post', {
        openId,
        schoolId: this._schoolId,
        scoreList: app.globalData.scoreList
      });
      console.log('detailRes', detailRes)
      if(detailRes && detailRes?.data){
        const { majorList, score } = detailRes.data;
        this._score = score;
        const details = majorList.map(e=>{
          e.score = this._score
          e.scoreDiff = this._score - (e?.shortlistedScore === '/' ? null : Number(e?.shortlistedScore) || 0)
          e.needScore = e.minimumAdmissionScore - this._score
          return e
        })
        this.setData({
          detailRes: details
        })
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
