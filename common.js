//url: 'https://www.dzbjapp.com/api/'
const url = 'http://localhost:9000/api/';
const merchantId = 1;
module.exports = {
  getData(params) {
    let data = params.data || {};
    data.mid = merchantId;
    wx.request({
      url: url + params.path,
      method: params.type ? params.type : 'GET',
      data: data,
      success: function(res){
        params.fnsuc(res.data)
      },
      fail: function(err){
        console.log(err)
      }
    })
  }
}