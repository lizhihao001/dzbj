// pages/book/book.js
const util = require('../../utils/util.js');
const nowDate = require('../../utils/date.js');
const pickerData = require('../../utils/week.js');
const formatLocation = util.formatLocation;
console.log();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carData: [{
      id: 'car0',
      name: '面包车',
      img: '../../images/1.jpg',
      spec: [{
        spec: '30元(5公里)',
        info: '起步价'
      }, {
        spec: '3.0元/公里',
        info: '超里程费'
      }, {
        spec: '1.7*1.1*1m',
        info: '长*宽*高'
      }]
    },
    {
      id: 'car1',
      name: '中型面包',
      img: '../../images/2.jpg',
      spec: [{
        spec: '55元(5公里)',
        info: '起步价'
      }, {
        spec: '4.0元/公里',
        info: '超里程费'
      }, {
        spec: '2.6*1.6*1.5m',
        info: '长*宽*高'
      }]
    },
    {
      id: 'car2',
      name: '平板车',
      img: '../../images/3.jpg',
      spec: [{
        spec: '50元(5公里)',
        info: '起步价'
      }, {
        spec: '4.0元/公里',
        info: '超里程费'
      }, {
        spec: '2*1.5*1.8m',
        info: '长*宽*高'
      }]
    },
    {
      id: 'car3',
      name: '小型箱货',
      img: '../../images/4.jpg',
      spec: [{
        spec: '65元(5公里)',
        info: '起步价'
      }, {
        spec: '4.0元/公里',
        info: '超里程费'
      }, {
        spec: '2*1.6*1.5m',
        info: '长*宽*高'
      }]
    },
    {
      id: 'car4',
      name: '大型箱货',
      img: '../../images/5.jpg',
      spec: [{
        spec: '99元(5公里)',
        info: '起步价'
      }, {
        spec: '5.0元/公里',
        info: '超里程费'
      }, {
        spec: '4.2*2*1.8m',
        info: '长*宽*高'
      }]
    }
    ],
    actIndex: 0,
    actScrollId: 'car0',
    isShowTimePicker: false,
    arrDate: [],
    arrHour: [],
    arrMin: ['00', '15', '30', '45'],
    bookDate: nowDate(2).fullDate + ' ' + nowDate(2).nowHour +':'+nowDate(2).nowMin+':00',
    strBookDate: '',
    tipBookDate: '现在',
    addFrom:{
      address:'请选择起始地',
      lat:'',
      lng:''
    },
    addTo: {
      address: '请选择目的地',
      lat: '',
      lng: ''
    },
    addType:1,
    dis:0,
    qty:0,
    totalPrcie:0



    
  },
  //点击车型按钮
  bindOpenSetting(e){
    console.log(JSON.stringify(e))
  },
  switchCar(e) {
    let index = e.target.dataset.index;
    console.log(index)
    this.setData({
      actIndex: index
    })
  },
  //切换swiper
  switchSwipe(e) {
    console.log(JSON.stringify(e))
    let index = e.detail.current;
    this.setData({
      actIndex: index,
      actScrollId: 'car' + index
    })
  },
  showTimePicker() {
    this.setData({
      isShowTimePicker: true, 
    })
  },
  hideTimePicker(e) {
    console.log(this.data.bookDate)
    if(e.target.dataset.type == 2){
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
  },
  selectBookTime() {

  },
  selectAddress(e) {
    let self = this;
    let type = e.currentTarget.dataset.type;
    wx.chooseLocation({
      success: function(res) {
        if (type == 1) {
          self.setData({
            addFrom:{
              address:res.name,
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
      fail: function(res){
        console.log('fail===' + JSON.stringify(res))
        if (res.errMsg == 'chooseLocation:fail auth deny'){
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
        let distance = data.data.result.routes[0].distance < 1000 ? data.data.result.routes[0].distance + '米' : (data.data.result.routes[0].distance/1000).toFixed(1) + '公里';
        console.log('distance==' + distance)

        self.setData({
          dis: ((data.data.result.routes[0].distance) / 1000).toFixed(1)
        });
        wx.hideLoading()
      },
      fail: function (data) {
        wx.hideLoading()
      }
    })
  },
  selectManPower(e){
    let type = e.currentTarget.dataset.type;
    if(type == 1){
      if(this.data.qty <= 0){
        this.setData({
          qty:0
        })
      }else{
        this.data.qty --;
        this.setData({
          qty:this.data.qty
        })
      }
    }else{
      this.data.qty++;
      this.setData({
        qty:this.data.qty
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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