function nowDate(type) {
  var D = new Date();
  if (type == 1) {
    return {
      nowMonth: (D.getMonth() + 1) < 10 ? ("0" + (parseInt(D.getMonth()) + 1)) : D.getMonth() + 1,
      nowYear: D.getFullYear(),
      nowDay: D.getDate() < 10 ? ("0" + D.getDate()) : D.getDate(),
      nowHour: D.getHours(),
      nowMin: D.getMinutes()
    }
  } else {
    return {
      nowMonth: D.getMonth() + 1,
      nowYear: D.getFullYear(),
      nowDay: D.getDate(),
      nowHour: D.getHours(),
      nowMin: D.getMinutes(),
      fullDate: D.getFullYear() + "-" + (D.getMonth() + 1) + "-" + D.getDate()
    }
  }
}
module.exports=nowDate;