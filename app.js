//app.js
App({
  globalData: {
    sztuAPI_login: "https://www.sztu.top/login.php",
    sztuAPI_getcode: "https://www.sztu.top/code.php",
    sztuAPI_push: "https://www.sztu.top/post.php",
    sztuAPI_userinfo: "https://www.sztu.top/user.php",
    sztuAPI_dingdan: "https://www.sztu.top/information.php",
    sztuAPI_mycreated: "https://www.sztu.top/my_created.php",
    sztuAPI_join: "https://www.sztu.top/join.php",
    sztuAPI_myJoin: "https://www.sztu.top/my_join.php",
    sztuAPI_exit: "https://www.sztu.top/out.php",
    sztuAPI_xiugai: "https://www.sztu.top/revise.php",
    sztuAPI_setstate: "https://www.sztu.top/setstate.php",
    sztuAPI_search: 'https://www.sztu.top/search.php',
    sztuAPI_getuserinfo: 'https://www.sztu.top/getuser.php',
    login_id: '',
    code: '',
  },
  getloginid() {

    var code = getApp().globalData.code
    wx.request({
      url: this.globalData.sztuAPI_login,
      data: {
        code: code
      },
      fail(res) {
        wx.showModal({
          title: '错误',
          content: '可能有网络问题，点击确认重试，如果多次尝试失败请反馈开发者' + "(错误信息：" + res.errMsg + ")",
          showCancel: false,
          success(res) {
            if (res.confirm) {
              getApp().getloginid();
            }
          }
        })
      },
      success(res) {
        getApp().globalData.login_id = res.data.login_id
        if (res.data.check_reg == "1") {
          wx.switchTab({
            url: '../index/index'
          })
        } else if (res.data.check_reg == "0") {
          wx.redirectTo({
            url: '../register/register'
          })
        }else if(res.data.errcode == '115'){
          wx.showModal({
            title: '诶哟',
            content: '验证码错了额(⊙﹏⊙)',
            showCancel:false
          })
        } 
        else {
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新或与开发者联系',
            showCancel: false
          })
        }

      }
    })
  },
  onLaunch: function() {

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        getApp().globalData.code = res.code
        this.getloginid();
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },



})