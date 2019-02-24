const app = getApp()

Page({
  data: {
    AgreeCheck:false,
    checkicon:[{
      icontype: "",
      iconcolor: "green",
      icondisplay: ""
    },
      {
        icontype: "",
        iconcolor: "green",
        icondisplay: ""
      },
      {
        icontype: "",
        iconcolor: "green",
        icondisplay: ""
      }
    ],
    time: '获取', //倒计时 
    currentTime: 61,
    PhoneNumber: "",
    code: ""
  },


  wechat(event){
    this.setData({
      wechat: event.detail.value
    })
  },

  SavePNumber(event) {
    this.setData({ PhoneNumber : event.detail.value });
  },
  checkPnumber(){
    if (this.data.PhoneNumber.length != 11) {
      this.setData(
        {
          "checkicon[0].icontype": "warn",
          "checkicon[0].iconcolor": "red",
          "checkicon[0].icondisplay": ""//12345678912
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

  SaveCode(event) {
    this.setData({ code: event.detail.value });
  },
  Submit: function () {
    let that = this
    if (this.data.checkicon[0].icontype == 'success'  && this.data.code.length == 5){
      if (that.data.AgreeCheck == true) {
        wx.showLoading({
          title: '验证中...',
          mask: false
        })
        wx.request({
          url: app.globalData.sztuAPI_register,
          data: {
            login_id: app.globalData.login_id,
            pnum: this.data.PhoneNumber,
            code: this.data.code,
            wechat: this.data.wechat
          },
          success(res) {

            wx.hideLoading()
            if(res.data.errcode == '0'){
              wx.showToast({
                title: '验证成功',
                icon: 'success'
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '../helpst/helpst',
                })
              }, 1000)

            }else{
              wx.showModal({
                title: '哦嚯o_o',
                content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请重试或与客服联系',
                showCancel: false
              })
            }
          },
          fail(){
            wx.hideLoading()
            wx.showModal({
              title: '请求失败',
              content: '请检查网络或重试',
              showCancel:false
            })
          }
        })

      }
      else if (that.data.AgreeCheck == false) {
        wx.showToast({
          image: '../../resource/icon-bang.png',
          title: '请同意免责声明'
        })
      }

    }
    else{
      wx.showModal({
        title: '错误',
        content: "请检查信息是否填写正确",
        showCancel: false
      })
    }
  },
  getCode: function (options) {
    var interval = null;
    let that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重发',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)
  },
  getVerificationCode() {
    wx.showLoading({
      title: '发送中...',
    })
      wx.request({
        url: app.globalData.sztuAPI_register,
        data: {
          login_id: app.globalData.login_id,
          pnum: this.data.PhoneNumber
        },
        success(res) {
          wx.hideLoading()
          if (res.data.errcode == '0'){
            wx.showToast({
              title: '发送成功'
            })
          }
          else{
            wx.showModal({
              title: '哦嚯o_o',
              content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请重试或与客服联系',
              showCancel: false
            })
          }
        },
        fail(){
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '发送请求失败，请重试',
            showCancel:false
          })
        }
      })
      this.getCode();
      let that = this
      that.setData({
        disabled: true
      })
  },
  agree(e){
    if (this.data.AgreeCheck == true){
      this.data.AgreeCheck = false
      this.setData({
        AgreeCheck: this.data.AgreeCheck
      })
    }
    else{
      this.data.AgreeCheck = true
      this.setData({
        AgreeCheck: this.data.AgreeCheck
      })
    }
  },
  getcodebtn(){
    if (this.data.PhoneNumber.length == 11) {
      this.getVerificationCode();
    }
    else {
      wx.showModal({
        title: '错误',
        content: "请检查信息是否填写正确",
        showCancel: false
      })
    }
  },
  agreedetail() {
    wx.navigateTo({
      url: '../agree/agree'
    })
  }
})