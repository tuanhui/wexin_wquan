var app = getApp();
Page({
  data:{
    ads:{},
    guess_circles:{}
  },
  intoCircle:function(event){
    console.log(event);
    console.log(event.currentTarget.dataset.circleId);
    wx.navigateTo({
      url: '/pages/news_list/news_list?circle_id=' + event.currentTarget.dataset.circleId,
    })
  },
  onLoad: function(){
    var that = this;    
    app.getUserInfo(function(res){
      var user = res;
      var token = user["local_token"];
      console.log(token);
      var url = "http://www.wquan.net/Api/Discover/Discover/?l=zh-cn";
      wx.request({
        url: url,
        method: "POST",
        header: { "Content-Type":"application/x-www-form-urlencoded"},
        data:{
          "token": token
        },
        success: function(res){
          console.log(res.data.data);
          that.setData({
            ads: res.data.data.ads,
            guess_circles: res.data.data.guess_circles
          });
        },
        fail: function(res){
          console.log(res);
        }
      })
    })
  }
})
