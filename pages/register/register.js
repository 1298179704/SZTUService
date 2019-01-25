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
    ID: "",
    Name: "",
    PhoneNumber: "",
    code: ""
  },


  SaveID(event) {
    this.setData({ ID: event.detail.value })
  },
  wechat(event){
    this.setData({
      wechat: event.detail.value
    })
  },
  SaveName(event) {
    this.setData({ Name: event.detail.value })
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
  checkName(e){
    let name = e.detail.value
    if (name != '') {
      this.setData(
        {
          "checkicon[2].icontype": "success",
          "checkicon[2].iconcolor": "green",
          "checkicon[2].icondisplay": ""

        }
      )
    }
    else {
      this.setData(
        {
          "checkicon[2].icontype": "warn",
          "checkicon[2].iconcolor": "red",
          "checkicon[2].icondisplay": ""
        }
      )
    }

  },
  checkid(e){
    let id = e.detail.value
    if (id.length != 11 && id.length != 5) {
      this.setData(
        {
          "checkicon[1].icontype": "warn",
          "checkicon[1].iconcolor": "red",
          "checkicon[1].icondisplay": ""//12345678912
        }
      )
    }
    else {
      this.setData(
        {
          "checkicon[1].icontype": "success",
          "checkicon[1].iconcolor": "green",
          "checkicon[1].icondisplay": ""
        }
      )
    }
  },
  SaveCode(event) {
    this.setData({ code: event.detail.value });
  },
  Submit: function () {
    let that = this
    if (this.data.checkicon[0].icontype == 'success' && this.data.Name != '' && this.data.checkicon[1].icontype == 'success' && this.data.code != ''){
      if (that.data.AgreeCheck == true) {
        wx.showLoading({
          title: '验证中...',
          mask: false
        })
        wx.request({
          url: app.globalData.sztuAPI_getcode,
          data: {
            login_id: app.globalData.login_id,
            id: this.data.ID,
            name: this.data.Name,
            pnum: this.data.PhoneNumber,
            code: this.data.code,
            wechat: this.data.wechat
          },
          success(res) {

            wx.hideLoading()
            if(res.data.errcode == '0'){
              wx.redirectTo({
                url: '../helpst/helpst'
              })

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
        url: app.globalData.sztuAPI_getcode,
        data: {
          login_id: app.globalData.login_id,
          getcode: '1',
          pnum: this.data.PhoneNumber, 
          name: this.data.Name,
          id: this.data.ID
        },
        success(res) {
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
          wx.showModal({
            title: '错误',
            content: '发送请求失败，请重试',
            showCancel:false
          })
        },
        complete(){
          wx.hideLoading()
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
    if ((this.data.ID.length == 5 || this.data.ID.length == 11) && this.data.Name != '' && this.data.PhoneNumber.length == 11) {
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