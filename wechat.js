
module.exports =  {
  login() {
    let promise = new Promise(function (resolve, reject) {
      wx.login({
        success(res) {
          resolve(res.code)
        }
      })
    });
    return promise;
  }
};