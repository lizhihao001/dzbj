function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
//腾讯转百度坐标
function transPos(lat, lon) {
  var bd_lat;
  var bd_lon;
  var x_pi = Math.PI;
  var x = lon,
    y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  bd_lon = z * Math.cos(theta) + 0.0065;
  bd_lat = z * Math.sin(theta) + 0.006;

  console.log("bd_lat:" + bd_lat);
  console.log("bd_lon:" + bd_lon);
  return bd_lat.toFixed(6) + "," + bd_lon.toFixed(6);
}
module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  transPos: transPos,
  baiduUrl:'https://api.map.baidu.com/direction/v2/driving',
  baiduKey:'LBXiN7psY2fgYQ7Mx1QqoQCE'
}
