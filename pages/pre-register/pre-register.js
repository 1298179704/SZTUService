const app = getApp()
Page({

  data: {
    checkicon: [{
      icontype: "",
      iconcolor: "green",
      icondisplay: ""
    }],
    id: '',
    password: ''
  },

  jwxtID(e) {
    this.setData({
      id: e.detail.value
    })
  },

  jwxtPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  checkID(e) {
    let id = e.detail.value
    if (id.length != 11 && id.length != 5 && id.length != 10) {
      this.setData(
        {
          "checkicon[0].icontype": "warn",
          "checkicon[0].iconcolor": "red",
          "checkicon[0].icondisplay": ""
        }
      )
    }
    else {
      this.setData(
        {
          "checkicon[0].icontype": "success",
          "checkicon[0].iconcolor": "green",
          "checkicon[0].icondisplay": ""
        }
      )
    }
  },
  submit(){
    if (this.data.checkicon[0].icontype == 'success' && this.data.password != ''){
      wx.showLoading({
        title: '验证中...',
        mask: false
      })
    wx.request({
      url: app.globalData.sztuAPI_register,
      data: {
        login_id: app.globalData.login_id,
        id: this.data.id,
        password: this.data.password
      },
      success(res){
        wx.hideLoading()
        if(res.data.errcode == '0'){
          wx.showToast({
            title: '验证成功',
            icon: 'success'
          })
          setTimeout(function(){wx.redirectTo({
            url: '../register/register',
          })},1000)
          
        }else{
          wx.showModal({
            title: '错误',
            content: '错误信息：' + res.data.errmsg + '，错误代码：' + res.data.errcode + '。请重试或联系客服',
            showCancel: false
          })
        }
      },
      fail(){
        wx.hideLoading()
        wx.showModal({
          title: '错误',
          content: '请求失败，请检查网络。点击“确认”重试',
          showCancel: false
        })
      }
    })}else{
      wx.showModal({
        title: '诶哟',
        content: '请检查是否正确填写教务系统验证信息',
        showCancel: false
      })
    }
  },
  onShow() {
    wx.request({
      url: app.globalData.sztuAPI_register,
      data: {
        login_id: app.globalData.login_id
      },
      success(res) {
        if (res.data.check_reg == '0') {

        } else if (res.data.check_reg == '1') {
          wx.switchTab({
            url: '../index/index',
          })
        } else if (res.data.check_reg == '2') {
          wx.redirectTo({
            url: '../register/register',
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '错误信息：' + res.data.errmsg + '，错误代码码：' + res.data.errcode + '。请重试或联系客服',
            showCancel: false
          })
        }
      },
      fail() {
        wx.showModal({
          title: '错误',
          content: '验证注册状态失败，请检查网络。点击“确认”重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              this.onShow()
            }
          }
        })
      }
    })
  }
})