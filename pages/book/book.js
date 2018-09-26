// pages/book/book.js
const util = require('../../utils/util.js');
const nowDate = require('../../utils/date.js');
const pickerData = require('../../utils/week.js');
const formatLocation = util.formatLocation;
const func = require('../../common.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carData: [],
    actIndex: 0,
    actScrollId: 'car0',
    isShowTimePicker: false,
    arrDate: [],
    arrHour: [],
    arrMin: ['00', '15', '30', '45'],
    bookDate: nowDate(2).fullDate + ' ' + nowDate(2).nowHour + ':' + nowDate(2).nowMin + ':00',
    strBookDate: '',
    tipBookDate: '现在',
    addFrom: {
      address: '请选择起始地',
      lat: '',
      lng: ''
    },
    addTo: {
      address: '请选择目的地',
      lat: '',
      lng: ''
    },
    addType: 1,
    dis: 0,//实际里程
    qty: 0,
    totalPrice: 0,
    showFee: false,
    showSideNav: false,
    iniPrice: 0,
    exceedPrice: 0,//超里程定价
    iniDis: 0,//起步里程,
    exceedPriceTotal: 0, //超里程费用(计算后)
    exceedDis: 0
  },
  to_user() {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  //点击车型按钮
  switchCar(e) {
    let index = e.target.dataset.index;
    console.log(index)
    this.setData({
      actIndex: index
    })
    this.getPrice()
  },
  //切换swiper
  switchSwipe(e) {
    let index = e.detail.current;
    this.setData({
      actIndex: index,
      actScrollId: 'car' + index
    })
    this.getPrice()
  },
  showTimePicker() {
    this.setData({
      isShowTimePicker: true,
    })
  },
  hideTimePicker(e) {
    console.log(this.data.bookDate)
    if (e.target.dataset.type == 2) {
      this.setData({
        isShowTimePicker: false,
        tipBookDate: this.data.strBookDate ? this.data.strBookDate : '现在'
      })
    } else {
      this.data.bookDate = '';
      this.setData({
        isShowTimePicker: false
      })
    }
    this.setData({
      showFee: false
    })
  },
  showFeeDetail() {
    this.setData({
      showFee: true
    })
  },
  selectBookTime() {

  },
  selectAddress(e) {
    let self = this;
    let type = e.currentTarget.dataset.type;
    wx.chooseLocation({
      success: function (res) {
        if (type == 1) {
          self.setData({
            addFrom: {
              address: res.name,
              lat: res.latitude,
              lng: res.longitude
            }
          })
        } else {
          self.setData({
            addTo: {
              address: res.name,
              lat: res.latitude,
              lng: res.longitude
            }
          })
        }
        if (self.data.addFrom.lat != '' && self.data.addTo.lat != '') {
          self.calDis()
        }
      },
      fail: function (res) {
        console.log('fail===' + JSON.stringify(res))
        if (res.errMsg == 'chooseLocation:fail auth deny') {
          wx.showModal({
            title: '',
            content: '需要您的位置授权才能选择地址',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })
  },
  calDis: function () {
    var self = this;
    wx.showLoading({
      title: '计算距离中...',
    })
    wx.request({
      url: util.baiduUrl,
      data: {
        origin: util.transPos(self.data.addFrom.lat, self.data.addFrom.lng),
        destination: util.transPos(self.data.addTo.lat, self.data.addTo.lng),
        ak: util.baiduKey
      },
      method: 'GET',
      success: function (data) {
        let distance = data.data.result.routes[0].distance < 1000 ? data.data.result.routes[0].distance + '米' : (data.data.result.routes[0].distance / 1000).toFixed(1) + '公里';
        console.log('distance==' + distance)
        let dis = ((data.data.result.routes[0].distance) / 1000).toFixed(1)
        self.setData({
          dis: dis
        });
        self.getPrice();
        wx.hideLoading();
      },
      fail: function (data) {
        wx.hideLoading()
      }
    })
  },
  selectManPower(e) {
    let type = e.currentTarget.dataset.type;
    if (type == 1) {
      if (this.data.qty <= 0) {
        this.setData({
          qty: 0
        })
      } else {
        this.data.qty--;
        this.setData({
          qty: this.data.qty
        })
      }
    } else {
      this.data.qty++;
      this.setData({
        qty: this.data.qty
      })
    }
    this.getPrice()
  },
  changeDate(e) {
    let selectDate = this.data.arrDate[e.detail.value[0]].fulldate;
    let selectDay = this.data.arrDate[e.detail.value[0]].day
    let strDay = selectDate.split('-');
    this.setData({
      arrHour: this.setHour(strDay[1], strDay[2])
    })

    let selectHour = this.data.arrHour[e.detail.value[1]];
    this.setData({
      arrMin: this.setMin(strDay[1], strDay[2], selectHour)
    })
    let selectMin = this.data.arrMin[e.detail.value[2]];
    this.data.bookDate = selectDate + ' ' + selectHour + ':' + selectMin + ':00';
    this.data.strBookDate = selectDay + ' ' + selectHour + '时' + selectMin + '分';

  },
  setHour(month, day) {
    const nowDay = nowDate(2).nowDay;
    const nowMon = nowDate(2).nowMonth;
    const nowHour = nowDate(2).nowHour;
    const nonMin = nowDate(2).nowMin;
    let hour = [];
    //如果是今天
    if (parseInt(day) == nowDay && parseInt(month) == nowMon) {
      for (let i = nowHour; i < 24; i++) {
        let h = i < 10 ? '0' + i : '' + i
        hour.push(h);
      }
    } else {
      for (let i = 0; i < 24; i++) {
        let h = i < 10 ? '0' + i : '' + i
        hour.push(h);
      }
    }
    return hour;
  },
  setMin(month, day, hour) {
    const nowDay = nowDate(2).nowDay;
    const nowMon = nowDate(2).nowMonth;
    const nowHour = nowDate(2).nowHour;
    const nowMin = nowDate(2).nowMin;
    let len = Math.ceil(nowMin / 15);
    let min = [];
    //如果是今天且小时相等
    if (parseInt(day) == nowDay && parseInt(month) == nowMon && parseInt(hour) == nowHour) {
      console.log('in min')
      for (let i = 45; i > nowMin; i -= 15) {
        let m = i < 10 ? '0' + i : '' + i;
        min.push(m);
      }
      min.reverse()
    } else {
      min = ['00', '15', '30', '45']
    }
    return min;
  },
  toUser() {
    wx.navigateTo({
      url: '../user/user',
    })
  },
  //获取列表
  getCarList() {
    let self = this;
    func.getData({
      path: 'admin/carlist',
      fnsuc(res) {
        if (res.status == 100) {
          self.setData({
            carData: res.data,
            iniPrice: res.data[0].ini_price,
            iniDis: res.data[0].ini_dis,
            exceedPrice: res.data[0].exceed_price,
            totalPrice: res.data[0].ini_price
          })
        }
      }
    })
  },
  getPrice() {
    let data = this.data.carData[this.data.actIndex];
    console.log(JSON.stringify(data))
    //超出的里程
    let dis = (this.data.dis - data.ini_dis) > 0 ? (this.data.dis - data.ini_dis) : 0;
    //超里程费用
    let exceedPrice = dis * data.exceed_price;
    //人力费用
    let manPrice = this.data.qty * 100
    //总价
    console.log('起步价:' + data.ini_price)
    console.log('超里程:' + exceedPrice)
    console.log('人力:' + manPrice)
    let totalPrcie = data.ini_price + parseFloat(exceedPrice) + parseInt(manPrice)
    console.log('总价:' + totalPrcie)
    this.setData({
      iniPrice: data.ini_price,
      iniDis: data.ini_dis,
      exceedPrice: data.exceed_price,
      exceedPriceTotal: exceedPrice,
      exceedDis: dis,
      totalPrice: totalPrcie
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarList()
    this.setData({
      arrDate: pickerData(),
      arrHour: this.setHour(nowDate(2).nowMonth, nowDate(2).nowDay),
      arrMin: this.setMin(nowDate(2).nowMonth, nowDate(2).nowDay, nowDate(2).nowHour)
    })
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