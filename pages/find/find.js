//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  }
})
