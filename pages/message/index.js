Page({
  /** 页面的初始数据 */
  data: {
    messageList: [
      {
        avatar: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/B4nVdzsJXiatURQvKg7qHv6SOs35RDVO15pCX0jiaiaoxbeWGyEic1SFZrIVw4iaZf3GEdGYBYTtMtnk3MB1fqsVwzA/640?wx_fmt=jpeg&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7',
        name: '国际本科院校推荐',
        content: '上海立信金融会计学院SQA3+1招生简章',
        url: 'https://mp.weixin.qq.com/s/oNVk70C4JPJTGi7tIrILNA'
      }
    ]
  },

  /** 生命周期函数--监听页面加载 */
  onLoad(options) {

  },
  openOfficialAccountArticle(event){
    const { url } = event.currentTarget.dataset;
    wx.openOfficialAccountArticle({
      url
    })
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
