// pages/order/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '请登录',
    userHeader: '../../images/defaut-headr.png'
  },
  get_user_info(e) {
    if (e.detail.errMsg == 'getUserInfo:fail auth deny') {
      wx.showModal({
        title: '',
        content: '需要您的授权才能获取用户信息',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting()
          }
        }
      })
    } else {
      var userData = {
        name: e.detail.userInfo.nickName,
        header: e.detail.userInfo.avatarUrl
      }
      wx.setStorageSync('userData', JSON.stringify(userData));
      this.setData({
        userName: userData.name,
        userHeader: userData.header
      })
    }
  },
  toOrder(){
    wx.navigateTo({
      url: '../order/order',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('userData'))
    if (wx.getStorageSync('userData')) {
      var userData = JSON.parse(wx.getStorageSync('userData'))
      this.setData({
        userHeader: userData.header,
        userName: userData.name
      })
    }
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