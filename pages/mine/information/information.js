// pages/mine/information/information.js
const app = getApp()
Page({


  data: {
    sex: 'Me',
    wechat: ' 未填写'

  },
  changeinfo() {
    wx.showModal({
      title: '错误',
      content: '暂时未开放修改',
      showCancel: false
    })
  },
  onShow() {
    let that = this
    wx.request({
      url: app.globalData.sztuAPI_userinfo,
      data: {
        login_id: app.globalData.login_id
      },
      success(res) {
        if (res.data.errcode == '0') {
          if (res.data.wechat) {
            that.setData({
              name: res.data.name,
              phone: res.data.phone,
              sex: res.data.sex,
              wechat: res.data.wechat
            })
          } else {
            that.setData({
              name: res.data.name,
              phone: res.data.phone,
              sex: res.data.sex
            })
          }
        } else if (res.data.errcode == '107') {
          wx.showModal({
            title: '非法用户',
            content: '请彻底关闭并重新打开小程序',
            showCancel: false
          })
        }else{
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新(返回再进入)或与开发者联系',
            showCancel: false
          })
        }
      }
    })
  }
})