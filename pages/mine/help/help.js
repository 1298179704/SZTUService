// pages/mine/help/help.js
Page({

  data: {
    mail: "1175459652@qq.com"
  },
  copymail(){
    wx.setClipboardData({
      data: this.data.mail,
      success: function () {
        wx.showToast({
          title: '已复制到粘贴板',
        })
      }
    })
  }


})