var olddistance = 0;  //这个是上一次两个手指的距离
var newdistance;      //本次两手指之间的距离，两个一减咱们就知道了滑动了多少，以及放大还是缩小（正负嘛）
var oldscale = 1;     //这个是上一次动作留下的比例
var diffdistance;     //这个是新的比例，新的比例一定是建立在旧的比例上面的，给人一种连续的假象
var baseHeight;       //上一次触摸完之后的高
var baseWidth;        //上一次触摸完之后的宽
var windowWidth = 0;  //咱们屏幕的宽
var windowHeight = 0; //咱们屏幕的高

var app = getApp();
Page({
  //这里是图片加载完毕之后的信息，因为滑动手指距离会变，我们要跟着图片的长宽进行缩放，不能跟着屏幕的长宽进行缩放
  imgload: function (e) {
    var originalWidth = e.detail.width;//图片原始宽
    var originalHeight = e.detail.height;//图片原始高
    var originalScale = originalHeight / originalWidth;//图片高宽比
    var windowscale = windowHeight / windowWidth;//屏幕高宽比
    if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比
      //图片缩放后的宽为屏幕宽
      baseWidth = windowWidth;

      baseHeight = (windowWidth * originalHeight) / originalWidth;
    } else {//图片高宽比大于屏幕高宽比
      //图片缩放后的高为屏幕高
      baseHeight = windowHeight;
      baseWidth = (windowHeight * originalWidth) / originalHeight;
    }
  },
  //两手指进行拖动了
  movetap: function (event) {
    var e = event;
    if (e.touches.length == 2) {
      var xMove = e.touches[1].clientX - e.touches[0].clientX;
      var yMove = e.touches[1].clientY - e.touches[0].clientY;
      var distance = Math.sqrt(xMove * xMove + yMove * yMove);//两手指之间的距离 
      if (olddistance == 0) {
        olddistance = distance; //要是第一次就给他弄上值，什么都不操作
        console.log(olddistance);
      }
      else {
        newdistance = distance; //第二次就可以计算它们的差值了
        diffdistance = newdistance - olddistance;
        olddistance = newdistance; //计算之后更新
        console.log(diffdistance);
        var newScale = oldscale + 0.005 * diffdistance;  //比例
        console.log(newScale);
        //刷新.wxml
        this.setData({
          scaleHeight: newScale * baseHeight,
          scaleWidth: newScale * baseWidth

        })
        oldscale = newScale;
        //更新比例

      }
    }
  },
  endtap: function (event) {
    console.log(event);//抬起手指，保存下数据
    if (event.touches.length == 2) {
      olddistance = 0;
    }

  },
  onLoad:function(option){
    this.setData({
      current: option.current,
      total: option.total,
      imgs: app.globalData.previewImgs
    });
  },
  change:function(event){
      this.setData({
        current: event.detail.current+1
      });
  },
  data: {
    imgs:[],
    current:1,
    total:0,
    scaleWidth: "",
    scaleHeight: "",
    dataimg: "",
  }
});