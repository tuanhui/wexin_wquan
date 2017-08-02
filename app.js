//app.js
var WECHAT_APP_ID = "wx7e5f8de92ee8e7fd";
var WECHAT_APP_SECRET = "11b25efa014b1e281cf563f4f258d4f6";
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var that = this;
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.screenWidth = res.screenWidth;
        that.globalData.screenHeight = res.screenHeight;
      },
    })
  },
  getUserInfo:function(cb){
      var that = this;
      var userInfo = wx.getStorageSync("user_info") || {};
      var user = wx.getStorageSync("user") || {};
      console.log(user);
      console.log(userInfo);
      if (!user.local_token || ((!userInfo.openid || (userInfo.expires_in
        || Date.now()) < (Date.now() + 600))
        && (!userInfo.nickName))) {
        //调用登录接口
        wx.login({
          success: function (res) {
            var code = res.code;
            if (code) {
              wx.getUserInfo({
                success: function (res) {
                  var data = JSON.parse(res.rawData);
                  var nickname = data.nickName;
                  var sex = data.gender;
                  var avatar = data.avatarUrl;
                  var access_token_url =
                    "https://api.weixin.qq.com/cgi-bin/token"
                    + "?grant_type=client_credential&appid="
                    + WECHAT_APP_ID + "&secret=" + WECHAT_APP_SECRET;
                  wx.request({
                    url: access_token_url,
                    method: "GET",
                    success: function (res) {
                      var access_token = res.data.access_token;
                      var url = "https://api.weixin.qq.com/sns/jscode2session"
                        + "?appid=" + WECHAT_APP_ID + "&secret="
                        + WECHAT_APP_SECRET + "&js_code="
                        + code + "&grant_type=authorization_code";
                      wx.request({
                        url: url,
                        method: "GET",
                        success: function (res) {
                          console.log(res);
                          var openid = res.data.openid;
                          var expires_in = Date.now() + res.data.expires_in;
                          var userInfo = {};
                          userInfo.openid = openid;
                          userInfo.expires_in = expires_in;
                          userInfo.access_token = access_token;
                          userInfo.nickName = nickname;
                          userInfo.sex = sex;
                          userInfo.avatar = avatar;
                          userInfo.deviceId = that.getUUID();
                          wx.setStorageSync("user_info", userInfo);
                          var loginUrl =
                            "http://www.wquan.net/Api/UserLogin/OauthLogin/?l=zh-cn";
                          wx.request({
                            url: loginUrl,
                            method: "POST",
                            data: {
                              "login_token": userInfo.access_token,
                              "id": userInfo.openid,
                              "nickname": userInfo.nickName,
                              "sex": userInfo.sex,
                              "avatar": userInfo.avatar,
                              "login_plat": "3",
                              "app_id": "1",
                              "device_id": userInfo.deviceId
                            },
                            header: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            success: function (res) {
                              console.log(res);
                              console.log("---------");
                              wx.setStorageSync("user", res.data.data);
                              that.globalData.user = res.data.data;
                              (typeof cb == 'function')
                               && cb(that.globalData.user);
                            },
                            fail: function (res) {
                              (typeof cb == 'function')
                                && cb(that.globalData.user);
                            }
                          })
                        }, fail: function (res) {
                          (typeof cb == 'function')
                            && cb(that.globalData.user);
                        }
                      });
                    }, fail: function (res) {
                      (typeof cb == 'function')
                        && cb(that.globalData.user);
                    }
                  });
                }, fail: function (res) {
                  (typeof cb == 'function')
                    && cb(that.globalData.user);
                }
              });
            }
          }
        })
      } else {
        console.log(user);
        that.globalData.user = user;
        (typeof cb == 'function')
          && cb(that.globalData.user);
      }
  },
  getUUID: function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
  globalData:{
    user: null,
    previewImgs:[],
    screenWidth:0,
    screenHeight:0,
    base_url: 'https://api.douban.com'
  }
})