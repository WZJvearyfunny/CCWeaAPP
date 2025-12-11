import request from '~/api/request';

const app = getApp();
Page({
  data: {
    searchTxt: '',
    tabIndex: 0,
    showAllSchoolList: [],
    practicalAllSchoolList: [],
    showMatchSchoolList: [],
    practicalMatchSchoolList: [],
  },
  onLoad(option) {
    if(app.globalData?.schoolList?.allSchoolList?.length){
        const allSchoolList = app.globalData.schoolList.allSchoolList
        this.setData({
            showAllSchoolList: allSchoolList,
            practicalAllSchoolList: allSchoolList
        })
    }
    if(app.globalData?.schoolList?.matchSchoolList?.length){
        const matchSchoolList = app.globalData.schoolList.matchSchoolList
        this.setData({
            showMatchSchoolList: matchSchoolList,
            practicalMatchSchoolList: matchSchoolList
        })
    }
  },
  onTabsChange(e){
    const { value } = e.detail;
    this.setData({
      tabIndex: value,
    });
  },
  changeHandle(e) {
    const { value } = e.detail;
    this.setData({
      searchTxt: value,
    });
  },

  async submitHandle(){
    const userInfo = wx.getStorageSync('user_info');
    const { openId } = userInfo;
    const { searchTxt, practicalAllSchoolList, practicalMatchSchoolList } = this.data;
    if(!searchTxt){
      this.setData({
        showAllSchoolList: practicalAllSchoolList,
        showMatchSchoolList: practicalMatchSchoolList
      })
      return;
    }
    try{
      const res = await request('/api/user/queryScoresByName', 'post', {
        name: searchTxt,
        openId,
        scoreList: app.globalData.scoreList
      });
      console.log('res', res)
      const data = res?.data || [];
      this.setData({
        showAllSchoolList: data.allSchoolList,
        showMatchSchoolList: data.matchSchoolList
      })
    }catch(err){

    }
  },

  // submitHandle(){
  //   let list = [], showList = [],text = '';
  //   if(`${this.data.tabIndex}` === '0'){
  //     list = this.data.practicalAllSchoolList
  //     text = this.data.searchTxt
  //   }else if(`${this.data.tabIndex}` === '1'){
  //     list = this.data.practicalMatchSchoolList
  //     text = this.data.searchMatchTxt
  //   }
  //   if(list.length){
  //     if(text){
  //       showList = this.regexSearch(text, list)
  //     }else{
  //       if(`${this.data.tabIndex}` === '0'){
  //         showList = this.data.practicalAllSchoolList
  //       }else if(`${this.data.tabIndex}` === '1'){
  //         showList = this.data.practicalMatchSchoolList
  //       }
  //     }
  //   }
  //   if(`${this.data.tabIndex}` === '0'){
  //     this.setData({
  //       showAllSchoolList: showList
  //     })
  //   }else if(`${this.data.tabIndex}` === '1'){
  //     this.setData({
  //       showMatchSchoolList: showList
  //     })
  //   }
  // },
  regexSearch(query, data) {
    let regex;
    try {
        // 将查询转换为正则表达式，允许字符间有任意字符
        const pattern = query.split('').join('.*?');
        regex = new RegExp(pattern, 'i');
    } catch (e) {
        // 如果正则表达式无效，回退到简单搜索
        console.log('regexSearch', e)
    }
    
    return data
        .map(item => {
            const match = item.schoolName.match(regex);
            if (match) {
                return {
                  schoolName: item.schoolName,
                  schoolId: item.schoolId,
                  score: item.score,
                  tag: item.tag,
                };
            }
            return null;
        })
        .filter(item => item !== null)
  },
  toDetail(event){
    const { item } = event.currentTarget.dataset;
    console.log('item', item)
    const schoolId = item?.schoolId || '';
    const schoolName = item?.schoolName || '';
    const score = item?.score || '';
    if(schoolId){
      wx.navigateTo({
        url: `/pages/schoolDetail/index?schoolId=${schoolId}&schoolName${schoolName}&score=${score}`,
      });
    }
  }
});
