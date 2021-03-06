// pages/order/order.js
const func = require('../../common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordreData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  getList() {
    let self = this;
    func.getData({
      path: 'front/orderlist',
      data:{
        phone:wx.getStorageSync('phone')
      },
      fnsuc(res) {
        self.setData({
          orderData: res.data
        })
      }
    })
  },
  handleCancleOrder(e) {
    let id = e.currentTarget.dataset.id;
    let self = this
    wx.showModal({
      title: '取消订单',
      content: '确认取消订单吗？',
      success(res) {
        if (res.confirm) {
          func.getData({
            path: 'front/ordercancle',
            type: 'POST',
            data: {
              orderId: id
            },
            fnsuc(data) {
              if (data.status == 100) {
                self.getList()
              }
              wx.showToast({
                title: data.msg,
              })
            }
          })
        }
      }
    })

  },
  onLoad: function(options) {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})