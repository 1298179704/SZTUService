// pages/mine/help/help.js
Page({

  data: {
    mail: "1175459652@qq.com",
    left: 1,
    right: 0
  },

  toindex(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  arrow(e){
    let page = e.detail.current
    if(page == 0){
      this.setData({
        left: 1,
        right: 0
      })
    }else if(page == 1 || page == 2){
      this.setData({
        left: 0,
        right: 0
      })
    }else if(page == 3){
      this.setData({
        left: 0,
        right: 1
      })
    }
  },
  onReady(){
    wx.showToast({
      title: '认证成功',
      icon: 'success'
    })
  },
  onLoad(){
    this.setData({
      left: 1,
      right: 0
    })
  }


})