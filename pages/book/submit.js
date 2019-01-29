// pages/book/submit.js
const func = require('../../common.js');
const wechat = require('../../wechat.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    memo: '',
    params: {},
    memoLen:0
  },
  bindName(e) {
    this.data.name = e.detail.value
  },
  bindPhone(e) {
    this.data.phone = e.detail.value
  },
  bindMemo(e) {
    this.data.memo = e.detail.value
    this.setData({
      memoLen: e.detail.value.length
    })
  },
   toSubmit(e) {
     console.log(e)
    let self = this;
    wechat.login().then(result=>{
      if (!self.data.name) {
        wx.showToast({
          title: '请输入称呼',
          icon: 'none'
        })
        return
      }
      if (!/(^1[3-8][0-9]{9}$)/.test(self.data.phone)) {
        wx.showToast({
          title: '手机号码格式不正确',
          icon: 'none'
        })
        return
      }
      if (self.data.memo.length > 200) {
        wx.showToast({
          title: '备注内容不能超过200字',
          icon: 'none'
        })
        return
      }
      wx.showLoading({
        title: '预约中',
      })
      self.data.params.phone = self.data.phone;
      self.data.params.userName = self.data.name;
      self.data.params.memo = self.data.memo;
      self.data.params.code = result;
      self.data.params.formId = e.detail.formId
      func.getData({
        path: 'front/ordercreate',
        type: 'POST',
        data: self.data.params,
        fnsuc(res) {
          wx.hideLoading()
          if (res.status == 100) {
            wx.setStorageSync('phone', self.data.phone)
            wx.navigateTo({
              url: '../order/order',
            })
          }
        }
      })
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.params = wx.getStorageSync('bookInfo');
    console.log(this.data.params.phone)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})