var app = getApp();
Page({
  lower:function(event){
    if (!this.data.loading_more) {
        this.setData({
          loading_more: true,
          page : this.data.page + 1
        });
        this.loadPageDatas();
    }
  },
  loadPageDatas:function(){
    var that = this;
    app.getUserInfo(function (user) {
      wx.request({
        url: 'http://www.wquan.net/Api/News/NewsList',
        method: 'POST',
        header: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: {
          "token": user.local_token,
          "circle_id": that.data.circle_id,
          "page": that.data.page,
          "pagesize": that.data.pagesize,
          "type": 1
        },
        success: function (res) {
          console.log(res);
          var news = res.data.data.news_info;
          for (var key in news) {
            var item = news[key];
            var date = new Date(item.update_time * 1000);
            var month = date.getMonth() + 1
            if (month < 10) {
              month = '0' + month;
            }
            var day = date.getDate();
            if (day < 10) {
              day = '0' + day;
            }
            item.update_time = month + "月" + day + "日";
            console.log(item);
          }
          wx.hideLoading();
          var newsList = that.data.news || [];
          if (news && news.length > 0){
            newsList = newsList.concat(news);
          }
          that.setData({
            newsInfo: res.data.data,
            news: newsList,
            loading_more: false
          });
          console.log(that.data);
        }
      });
    });
  },
  onLoad:function(option){
      this.setData({
        screenW: app.globalData.screenWidth,
        screenH: app.globalData.screenHeight,
        circle_id: option.circle_id,
        page: 1,
        pagesize: '20'
      });

      wx.showLoading({
        title: '正在加载...',
      });
      this.loadPageDatas();
  },
  data:{
      loading_more:false,
      screenW:0,
      screenH:0,
      page : 0,
      pagesize : null,
      circle_id: null,
      newsInfo:{
      },
      news:[],
      time : function(option){
        console.log(option);
      }
  },
  previewImgs:function(option){
    var current = option.currentTarget.dataset.current || 0;
    var total = option.currentTarget.dataset.total || 0;
    console.log(current+"/"+total);
    var newsPosition = option.currentTarget.dataset.newsId;
    if (typeof newsPosition == 'number') {
      app.globalData.previewImgs = this.data.news[newsPosition].pic;
      console.log(app.globalData.previewImgs);
      wx.navigateTo({
        url: '/pages/img_preview/img_preview?current='+current+'&total='+total,
      })
    }
  }
});