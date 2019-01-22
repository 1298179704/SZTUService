const app = getApp()
Page({
  data: {
    search: "",
    item: []
  },
  search_input(e) {
    this.setData({
      search: e.detail.value
    })
  },
  search() {
    let that = this
    if (this.data.search != "") {
      wx.showLoading({
        title: '搜索中...',
      })
      wx.request({
        url: app.globalData.sztuAPI_search,
        data: {
          login_id: app.globalData.login_id,
          search: this.data.search,
        },
        success(res) {
          wx.hideLoading()
          if (res.data.errcode == '0') {
            let data = res.data.dingdan
            let ndate = that.changedate(data)
            let ndata = that.numbertoname(ndate)
            that.setData({
              item: ndata
            })
          } else if (res.data.errcode == '123') {
            wx.showModal({
              title: '诶呀',
              content: '没有搜索到相关活动',
              showCancel: false
            })
          } else {
            wx.showModal({
              title: '哦嚯o_o',
              content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新或与开发者联系',
              showCancel: false
            })
          }
        },
        fail() {
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '发送请求失败，请重试',
            showCancel: false
          })
        }
      })
    }else{
      wx.showModal({
        title: '哦豁',
        content: '请输入你要搜索活动相关地点信息',
        showCancel: false
      })
    }
  },
  join(e) {
    let that = this
    wx.showModal({
      title: '注意',
      content: '活动费用应由活动参与者和发起者平均分担或自行安排，小程序不参与活动费用的分配',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '加入活动中...',
            mask: true
          })
          let danhao = e.currentTarget.dataset.danhao
          wx.request({
            url: app.globalData.sztuAPI_join,
            data: {
              login_id: app.globalData.login_id,
              danhao: danhao
            },
            success(res) {
              wx.hideLoading()
              if (res.data.errcode == "0") {
                wx.showToast({
                  title: '加入成功',
                })
                setTimeout(function() {
                  wx.navigateTo({
                    url: '../mine/join/join'
                  })
                }, 600)


              } else if (res.data.errcode == "125") {
                let id = e.currentTarget.dataset.idx
                that.setData({
                  [`item[${id}].btn_state`]: true
                })
                wx.showModal({
                  title: '加入失败',
                  content: res.data.errmsg,
                  showCancel: false
                })
              } else {
                wx.showModal({
                  title: '加入失败',
                  content: res.data.errmsg,
                  showCancel: false
                })
              }

            }
          })
        }
      }
    })

  },
  //onShow 显示执行
  onShow: function() {
    let that = this
    //请求首页数据
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: app.globalData.sztuAPI_dingdan,
      data: {
        login_id: app.globalData.login_id,
      },
      success(res) {
        if (res.data.errcode == "0") {
          let data = res.data.dingdan
          let ndate = that.changedate(data)
          let ndata = that.numbertoname(ndate)
          that.setData({
            item: ndata
          })
        } else if (res.data.errcode == "123") {
          wx.showModal({
            title: '诶哟',
            content: '暂时没有可加入活动呢',
            confirmText: '我来发布',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../publish/publish',
                })
              } else if (res.cancel) {
                wx.switchTab({
                  url: '../mine/mine',
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新或与开发者联系',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                that.onShow()
              }
            }
          })
        }
      },
      complete() {
        wx.hideLoading()
      }
    })

  },
  //分开日期与时间
  changedate: function(e) {
    for (let key in e) {
      let date = this.timestampToTime(e[key]["date"])
      e[key]["date"] = date.slice(0, 10)
      e[key]["time"] = date.slice(11, 16)
    }
    return e
  },
  //时间戳转化为时间
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    return Y + M + D + h + m;
  },
  //代码转名字
  numbertoname: function(e) {
    this.setData({
      search: ""
    })
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
      let person_type = e[key]["creater_type"]
      if (person_type == "0") {
        e[key]["person_type"] = "学生"
      } else if (person_type == "1") {
        e[key]["person_type"] = "教师"
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
      e[key]["people1"] = parseInt(e[key]["people"]) + 1
    }
    return e
  },
  //下拉刷新
  onPullDownRefresh() {
    this.onShow()
    wx.stopPullDownRefresh()
  },

})