const app = getApp()
Page({
  data: {
    item: [],
  },

  calling: function (e) {
    wx.showLoading({
      title: '查找中...'
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
          } else if (order == 1 && res.data.wechat != '') {
            wx.setClipboardData({
              data: res.data.wechat,
              success: function() {
                wx.showToast({
                  title: '已复制到粘贴板',
                })
              }
            })
          } else if (order == 1 && res.data.wechat == '') {
            wx.showModal({
              title: '抱歉',
              content: '该用户没有提供微信号',
              showCancel: false
            })
          }
        } else {
          wx.hideLoading()
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新(返回再进入)或与开发者联系',
            showCancel: false
          })
        }
      }, 
      complete() {
        wx.hideLoading()
      }
    })
  },
  person(e) {
    wx.showLoading({
      title: '更改中...',
    })
    let that = this
    let danhao = e.currentTarget.dataset.danhao
    let people = parseInt(e.detail.value) + 1
    if (e.detail.value != e.currentTarget.dataset.person) {
      wx.request({
        url: app.globalData.sztuAPI_xiugai,
        data: {
          login_id: app.globalData.login_id,
          danhao: danhao,
          people: people
        },
        success(res) {
          wx.hideLoading()
          if (res.data.errcode == '0') {
            that.onShow()
          } else {
            wx.showModal({
              title: '哦嚯o_o',
              content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新或与开发者联系',
              showCancel: false,
              success(re) {
                if (re.confirm) {
                  that.onShow()
                }
              }
            })
          }
        },
        fail(){
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '发送请求失败，请重试',
            showCancel: false
          })
        }
      })
    }
  },
  note(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    if (this.data.item[id].disable == 0) {
      this.setData({
        [`item[${id}].disable`]: 1
      })
    } else if (this.data.item[id].disable == 1) {
      this.setData({
        [`item[${id}].disable`]: 0
      })
    }
    wx.showLoading({
      title: '更改中...',
    })
    let danhao = e.currentTarget.dataset.danhao
    let note = e.detail.value
    if (e.detail.value != e.currentTarget.dataset.note) {
      wx.request({
        url: app.globalData.sztuAPI_xiugai,
        data: {
          login_id: app.globalData.login_id,
          danhao: danhao,
          note: note
        },
        success(res) {
          wx.hideLoading()
          if (res.data.errcode == '0') {
            that.onShow()
          }else{
            wx.showModal({
              title: '哦嚯o_o',
              content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新或与开发者联系',
              showCancel: false,
              success(re) {
                if (re.confirm) {
                  that.onShow()
                }
              }
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
    }
  },
  //编辑备注
  EditNote: function(e) {
    let id = e.currentTarget.dataset.id
    if (this.data.item[id].disable == 0) {
      this.setData({
        [`item[${id}].disable`]: 1
      })
    } else if (this.data.item[id].disable == 1) {
      this.setData({
        [`item[${id}].disable`]: 0
      })
    }
  },
  ChangeActState: function(e) {
    let that = this
    let order = e.currentTarget.dataset.order
    let danhao = e.currentTarget.dataset.danhao
    wx.showLoading({
      title: '操作中...',
    })
    if(order == '1' || order == '2'){
      wx.request({
        url: app.globalData.sztuAPI_setstate,
        data: {
          login_id: app.globalData.login_id,
          danhao: danhao,
          state: order
        },
        success(res) {
          if (res.data.errcode == '0') {
            that.onShow()
          }else{
            wx.showModal({
              title: '哦嚯o_o',
              content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请重试或与开发者联系',
              showCancel: false
            })
          }
        },
        fail(){
          wx.showModal({
            title: '错误',
            content: '发送请求失败，请重试',
            showCancel: false
          })
        },
        complete(){
          wx.hideLoading()
        }
      })
      }
    
  },
  changedate: function(e) {
    for (let key in e) {
      let date = this.timestampToTime(e[key]["date"])
      e[key]["date"] = date.slice(0, 10)
      e[key]["time"] = date.slice(11, 16)
    }
    return e
  },
  timestampToTime: function(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    return Y + M + D + h + m;
  },
  numbertoname: function(e) {
    let nArr = [];
    for (let i in e) {
      nArr.push(e[i]);
    }
    //排序
    for (let j = 0; j < nArr.length - 1; j++) {
      for (let a = 0; a < nArr.length - 1 - j; a++) {
        if (nArr[a]["state"] > nArr[a + 1]["state"]) {
          let temp = nArr[a];
          nArr[a] = nArr[a + 1];
          nArr[a + 1] = temp;
        }
      }
    }
    for (let key in nArr) {
      let type = nArr[key]["tripmode"]
      if (type == "0") {
        nArr[key]["tripmode"] = "打车"
      } else if (type == "1") {
        nArr[key]["tripmode"] = "自驾"
      } else if (type == "2") {
        nArr[key]["tripmode"] = "骑行"
      } else if (type == "3") {
        nArr[key]["tripmode"] = "步行"
      }
      let sexlimit = nArr[key]["sex"]
      if (sexlimit == "0") {
        nArr[key]["sex"] = "不限"
        nArr[key]["gendervalue"] = "0"
      } else if (sexlimit == "1") {
        nArr[key]["sex"] = "女生"
        nArr[key]["gendervalue"] = "1"
      } else if (sexlimit == "2") {
        nArr[key]["sex"] = "男生"
        nArr[key]["gendervalue"] = "2"
      }
      let state = nArr[key]["state"]
      if (state == '2') {
        nArr[key]["order1"] = '已取消'
        nArr[key]["order2"] = '无效'
        nArr[key]["disable_cancel"] = 1
        nArr[key]["disable_zhaomu"] = 1
        nArr[key]["disabled_change"] = 0
        nArr[key]["disabled_cell"] = 0
      } else if (state == '1') {
        nArr[key]["order2"] = '已停招'
        nArr[key]["order1"] = '取消活动'
        nArr[key]["disable_cancel"] = 0
        nArr[key]["disable_zhaomu"] = 1
        nArr[key]["disabled_change"] = 0
        nArr[key]["disabled_cell"] = 1
      } else if (state == '0') {
        nArr[key]["order1"] = '取消活动'
        nArr[key]["order2"] = '停止招募'
        nArr[key]["disable_cancel"] = 0
        nArr[key]["disable_zhaomu"] = 0
        nArr[key]["disabled_change"] = 1
        nArr[key]["disabled_cell"] = 1
      } else if(state == '3'){
        nArr[key]["order1"] = '已过期'
        nArr[key]["order2"] = '无效'
        nArr[key]["disable_cancel"] = 1
        nArr[key]["disable_zhaomu"] = 1
        nArr[key]["disabled_change"] = 0
        nArr[key]["disabled_cell"] = 0
      }
      let acttype = nArr[key]["acttype"]
      if (acttype == "0") {
        nArr[key]["acttype"] = "其它"
      } else if (acttype == "1") {
        nArr[key]["acttype"] = "爬山"
      } else if (acttype == "2") {
        nArr[key]["acttype"] = "骑行"
      } else if (acttype == "3") {
        nArr[key]["acttype"] = "旅行"
      } else if (acttype == "4") {
        nArr[key]["acttype"] = "学习"
      }
      nArr[key]["disable"] = 1
      nArr[key]["selectPerson"] = ["1人", "2人", "3人", "4人", "5人", "6人"]
      nArr[key]["personvalue"] = parseInt(nArr[key]["people"]) - 1
      nArr[key]["selectgender"] = ["不限", "仅限女生", "仅限男生"]
      nArr[key]["joined"] = nArr[key]["people"] - nArr[key]["surplus"]
    }
    return nArr
  },
  onPullDownRefresh() {
    this.onShow()
    wx.stopPullDownRefresh()
  },
  onShow() {
    let that = this
    wx.showLoading({
      title: '查询中...',
    })
    wx.request({
      url: app.globalData.sztuAPI_mycreated,
      data: {
        login_id: app.globalData.login_id
      },
      success(res) {
        wx.hideLoading()
        if(res.data.errcode == '0'){
          let data = res.data.dingdan
          let ndate = that.changedate(data)
          let ndata = that.numbertoname(ndate)
          that.setData({
            item: ndata
          })
        } else if (res.data.errcode == '129'){
          wx.showModal({
            title: 'Oops',
            content: '你还没有发布过任何活动信息呢。快发布信息，寻找小伙伴吧！',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '../mine',
                })
              }
            }
          })
        }
        else{
          wx.showModal({
            title: '哦嚯o_o',
            content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新(返回再进入)或与开发者联系',
            showCancel: false
          })
        }

      },
      fail(){
        wx.hideLoading()
        wx.showModal({
          title: '请求失败',
          content: '请检查网络，或点击确认重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              that.onShow()
            }
          }
        })
      }
    })
  }



})