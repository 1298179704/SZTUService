const app = getApp()
Page({


  data: {
    item: [],

  },
  exit(e) {
    let that = this
    wx.showLoading({
      title: '退出中...'
    })
    wx.request({
      url: app.globalData.sztuAPI_exit,
      data: {
        login_id: app.globalData.login_id,
        danhao: e.currentTarget.dataset.danhao
      },
      success(res) {
        wx.hideLoading()
        if(res.data.errcode == '0'){
          wx.showToast({
            title: '退出成功',
          })
          that.onShow()
        }else{
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新(返回再进入)或与开发者联系',
            showCancel: false
          })
        }
      },
      fail(){
        wx.hideLoading()
      }
    })
  },
  calling: function(e) {
    wx.showLoading({
      title: '查找中...',
    })
    let sid = e.currentTarget.dataset.sid
    let order = e.currentTarget.dataset.order
    let danhao = e.currentTarget.dataset.danhao
    wx.request({
      url: app.globalData.sztuAPI_getuserinfo,
      data: {
        login_id: app.globalData.login_id,
        danhao: danhao,
        userid: sid
      },
      success(res) {
        if (res.data.errcode == "0") {
          if (order == 0) {
            wx.makePhoneCall({
              phoneNumber: res.data.phone
            })
          }
          else if (order == 1 && res.data.wechat != ''){
            wx.hideLoading()
            wx.setClipboardData({
              data: res.data.wechat,
              success: function () {
                wx.showToast({
                  title: '已复制到粘贴板',
                })
              }
            })
          }
          else if (order == 1 && res.data.wechat == ''){
            wx.hideLoading()
            wx.showModal({
              title: '抱歉',
              content: '该用户没有提供微信号',
              showCancel:false
            })
          }
        }
        else{
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新(返回再进入)或与开发者联系',
            showCancel: false
          })
        }
      },
      complete(){
        wx.hideLoading()
      }
    })
  },
  changedate(e) {
    for (let key in e) {
      let date = this.timestampToTime(e[key]["date"])
      e[key]["date"] = date.slice(0, 10)
      e[key]["time"] = date.slice(11, 16)
    }
    return e
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    return Y + M + D + h + m;
  },
  numbertoname(e) {
    for (let key in e) {
      let type = e[key]["tripmode"]
      if (type == "0") {
        e[key]["tripmode"] = "打车"
      } else if (type == "1") {
        e[key]["tripmode"] = "自驾"
      } else if (type == "2") {
        e[key]["tripmode"] = "骑行"
      } else if (type == "3") {
        e[key]["tripmode"] = "步行"
      }
      let sexlimit = e[key]["sex"]
      if (sexlimit == "0") {
        e[key]["sex"] = "不限"
      } else if (sexlimit == "1") {
        e[key]["sex"] = "女生"
      } else if (sexlimit == "2") {
        e[key]["sex"] = "男生"
      }
      let state = e[key]["state"]
      if (state == '2') {
        e[key]["order1"] = '已被取消'
        e[key]["disable_exit"] = 1
        e[key]["disabled_cell"] = 0
      } else if (state == '1') {
        e[key]["order1"] = '已被锁定'
        e[key]["disable_exit"] = 1
        e[key]["disabled_cell"] = 1
      } else if (state == '0') {
        e[key]["order1"] = '退出'
        e[key]["disable_exit"] = 0
        e[key]["disabled_cell"] = 1
      } else if (state == '3') {
        e[key]["order1"] = '过期活动'
        e[key]["disable_exit"] = 1
        e[key]["disabled_cell"] = 0
      }
      let acttype = e[key]["acttype"]
      if (acttype == "0") {
        e[key]["acttype"] = "其它"
      } else if (acttype == "1") {
        e[key]["acttype"] = "爬山"
      } else if (acttype == "2") {
        e[key]["acttype"] = "骑行"
      } else if (acttype == "3") {
        e[key]["acttype"] = "旅行"
      } else if (acttype == "4") {
        e[key]["acttype"] = "学习"
      }
      e[key]["joined"] = e[key]["people"] - e[key]["surplus"]
    }
    return e
  },
  onPullDownRefresh() {
    this.onShow()
    wx.stopPullDownRefresh()
  },
  onShow: function() {
    let that = this
    wx.showLoading({
      title: '查询中...',
    })
    wx.request({
      url: app.globalData.sztuAPI_myJoin,
      data: {
        login_id: app.globalData.login_id
      },
      success(res) {
        if (res.data.errcode == "0") {
          let ndate = that.changedate(res.data.dingdan)
          let ndata = that.numbertoname(ndate)
          that.setData({
            item: ndata
          })
        } else if (res.data.errcode == "128"){
          wx.showModal({
            title: 'Oops',
            content: '你还没有加入任何活动呢。',
            showCancel:false,
            success(res){
              if(res.confirm){
                wx.switchTab({
                  url: '../mine',
                })
              }
            }
          })
        } 
        else {
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新(返回再进入)或与开发者联系',
            showCancel: false
          })
        }
      },
      fail(){
        wx.showModal({
          title: '请求失败',
          content: '请检查网络，或点击确认重试',
          showCancel:false,
          success(res){
            if(res.confirm){
              that.onShow()
            }
          }
        })
      },
      complete(){
        wx.hideLoading()
      }
    })
  }



})