Page({
  /** 页面的初始数据 */
  data: {
    messageList: [
      {
        avatar: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/B4nVdzsJXiatURQvKg7qHv6SOs35RDVO15pCX0jiaiaoxbeWGyEic1SFZrIVw4iaZf3GEdGYBYTtMtnk3MB1fqsVwzA/640?wx_fmt=jpeg&from=appmsg&watermark=1&tp=webp&wxfrom=5&wx_lazy=1#imgIndex=7',
        name: '上海立信金融会计学院SQA3+1招生简章',
        content: '国际本科院校推荐',
        url: 'https://mp.weixin.qq.com/s/oNVk70C4JPJTGi7tIrILNA'
      },
      {
        avatar: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/B4nVdzsJXiasSzPQ5UYqoiaia046aPvlfjeOtcWkHicygoUAM7UVrdHT3fv05Nb3FvYx1jCU5nl6Ie9tibDTGwOFnag/640?wx_fmt=jpeg&from=appmsg&wxfrom=13&tp=wxpic#imgIndex=12',
        name: '南昌大学2+2招生简章招生简章',
        content: '国际本科院校推荐',
        url: 'https://mp.weixin.qq.com/s/8bhd_Y1Te27w2UjLT_hdEg'
      },
      {
        avatar: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/B4nVdzsJXiauQol7VAQNZe19ricaz6RxfawTS2KOyZRoquT35plvz5yjcw62pIgSk7G4IxkC11GTYw0GGMhWV5tQ/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=16',
        name: '华东交通大学中马新英2+2招生简章',
        content: '国际本科院校推荐',
        url: 'https://mp.weixin.qq.com/s/nL1GiGhkZ4OTOoWiXrxvUA'
      },
      {
        avatar: 'https://mmbiz.qpic.cn/sz_mmbiz_jpg/B4nVdzsJXiauq2MQN7IfMu9mfNIUH5yH1MMBATZmMEF8fZxoqdfZHpMKsUvwh1qYYBnCJ4aibKrg5lFlSqpUxx3A/640?wx_fmt=jpeg&from=appmsg&tp=wxpic&wxfrom=5&wx_lazy=1#imgIndex=9',
        name: '华东交通大学中日2+2项目招生简章',
        content: '国际本科院校推荐',
        url: 'https://mp.weixin.qq.com/s/aexNt9D1wYoIJi1WyY1VXg'
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
