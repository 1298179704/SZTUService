Page({
  data: {

  },

  Tojoin() {
    wx.navigateTo({
      url: 'join/join'
    })
  },
  Toagree() {
    wx.navigateTo({
      url: '../agree/agree'
    })


  },
  Topublish() {
    wx.navigateTo({
      url: 'publish/publish'
    })


  },
  ToInfo() {
    wx.navigateTo({
      url: 'information/information'
    })


  },
  Tohelp() {
    wx.navigateTo({
      url: 'help/help?registered=0'
    })
  }

})