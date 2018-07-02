
function getStrDate(day) {
  let date = new Date();
  date.setDate(date.getDate() + day);
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate()

  let data = {
    str_date1: m + "月" + d + "日",
    str_date2: y + "-" + m + "-" + d
  }

  return data;
}

function transToWeek(weekvalue) {
  let week;
  let weekValue;
  weekValue = new Date(weekvalue.replace(/-/g, '/')).getDay()
  switch (weekValue) {
    case 1:
      week = "周一";
      break;
    case 2:
      week = "周二";
      break;
    case 3:
      week = "周三";
      break;
    case 4:
      week = "周四";
      break;
    case 5:
      week = "周五";
      break;
    case 6:
      week = "周六";
      break;
    case 0:
      week = "周日";
      break;
  }
  return week;
}

function getDateData() {
  let arrDate = [];
  let data = {}
  for (let i = 0; i < 30; i++) {
    if (i == 0) {
      data = {
        "day": getStrDate(i).str_date1,
        "week": '今天',
        "fulldate": getStrDate(i).str_date2
      }
    } else if (i == 1) {
      data = {
        "day": getStrDate(i).str_date1,
        "week": '明天',
        "fulldate": getStrDate(i).str_date2
      }
    } else if (i == 2) {
      data = {
        "day": getStrDate(i).str_date1,
        "week": '后天',
        "fulldate": getStrDate(i).str_date2
      }
    }
    else {
      data = {
        "day": getStrDate(i).str_date1,
        "week": transToWeek(getStrDate(i).str_date2),
        "fulldate": getStrDate(i).str_date2
      }
    }
    arrDate.push(data);
  }
  return arrDate;
}
module.exports = getDateData;