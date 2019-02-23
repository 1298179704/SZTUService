const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
    items: [{
        name: '1',
        value: '网约车',
        checked: 'true'
      },
      {
        name: '0',
        value: '私家车'
      },
    ],
    cartype: "1",
    time: "集合时间",
    date: "集合日期",
    StartName: "集合地点",
    start: '',
    startaddress: "",
    end: '',
    EndName: "活动地点",
    endaddress: "",
    selectPerson: ["1人", "2人", "3人", "4人", "5人", "6人"],
    personvalue: "1",
    person: '2',
    selectgender: ["不限", "女生", "男生"],
    gendervalue: "0",
    note: "无",
    selectTripmode:["打车","自驾","骑行","步行"],
    Tripmodevalue: "0",
    selectactivitytype: ["其它","爬山","骑行","旅行","学习"],
    acttypevalue:"0"
  },
  notedetail() {
    wx.showModal({
      title: '备注',
      content: '不超过25个字，可以备注如何联系、活动类型、准备物品等',
      showCancel: false
    })
  },
  transport(e) {
    this.setData({
      Tripmodevalue: e.detail.value
    })
  },
  person(e) {
    let person = parseInt(e.detail.value) + 1
    this.setData({
      personvalue: e.detail.value,
      person: person
    })
  },
  acttype(e) {
    this.setData({
      acttypevalue: e.detail.value
    })
  },

  //性别
  gender(e) {
    this.setData({
      gendervalue: e.detail.value
    })
  },


  //地点选择

  chooseStartLocation() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.chooseLocation({
      success: function(res) {
        wx.hideLoading()
        let start = res.longitude + "," + res.latitude
        if (res.name != "") {
          that.setData({
            StartName: res.name,
            start: start,
            startaddress: res.address
          })
        }
      },
      fail(){
        wx.hideLoading();
        wx.getSetting({
          success: function(res){
          
            console.log(res.authSetting.scope.userLocation)
           

            }





        })
          
        
      },
      

    })
  },
  chooseEndLocation() {
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.chooseLocation({
      success: function(res) {
        wx.hideLoading()
        let end = res.longitude + "," + res.latitude
        if (res.name != "") {
          that.setData({
            EndName: res.name,
            end: end,
            endaddress: res.address
          })
        }
      },
      fail(e) {
        wx.hideLoading()
      }
    })
  },
  //时间
  TimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  NoteChange(e) {
    this.setData({
      note: e.detail.value
    })
  },
  InformationSubmit() {
    let that = this
    if (this.data.start != "" && this.data.end != "" && this.data.date != "点击选择日期" && this.data.time != "点击选择时间") {
      let nowtime = (Date.parse(new Date())) / 1000
      let date = that.data.date + " " + that.data.time + ":00"
      let date2 = date.replace(/\-/g, "/")
      let datestamp = (Date.parse(new Date(date2))) / 1000
      if (datestamp > nowtime) {
        wx.showLoading({
          title: '发布中...',
          mask:true
        })
        wx.request({
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          url: app.globalData.sztuAPI_push,
          data: {
            login_id: app.globalData.login_id,
            tripmode: that.data.Tripmodevalue,
            start_name: that.data.StartName,
            start: that.data.start,
            start_address: that.data.startaddress,
            end_name: that.data.EndName,
            end: that.data.end,
            end_address: that.data.endaddress,
            people: that.data.person,
            date: datestamp,
            sex: that.data.gendervalue,
            note: that.data.note,
            acttype: that.data.acttypevalue
          },
          success(res) {
            wx.hideLoading()
            if (res.data.errcode == "0") {
              wx.showToast({
                title: '发布成功',
                icon:'success'
              })
              setTimeout(function () {
                wx.navigateTo({
                  url: '../mine/publish/publish',
                })},600)

            } else {
              wx.showModal({
                title: '哦嚯o_o',
                content: '错误信息：' + res.data.errmsg + ' | 错误代码：' + res.data.errcode + ' | 请尝试刷新或与客服联系',
                showCancel: false
              })
            }
          },
          fail() {
            wx.hideLoading()
            wx.showModal({
              title: '错误',
              content: '发送请求失败，请重试',
              showCancel: false,
            })
          }
        })
      } else {
        wx.showModal({
          title: '嗯?',
          content: '请选择一个未来的时间哦',
          showCancel: false
        })
      }
    } else {
      wx.showModal({
        title: '哦嚯',
        content: '请检查是否填漏信息哦(⊙o⊙)',
        showCancel: false
      })
    }
  },
  onShow: function() {
    let startdate = util.formatTime(new Date())
    startdate = startdate.slice(0, 10)
    let enddateyear = startdate.slice(0, 4)
    enddateyear = parseInt(enddateyear) + 1
    enddateyear = String(enddateyear)
    let enddate = enddateyear + startdate.slice(4)
    this.setData({
      startdate: startdate,
      enddate: enddate
    })
  }

})