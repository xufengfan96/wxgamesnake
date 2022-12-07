// components/rollingCaption/rollingCaption.js
Component({
  lifetimes: {
    ready() {
      var that = this;
      var query = this.createSelectorQuery();
      // 选择id
      query.select("#mjltest").boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec(function (res) {
        var length = res[0].width;
        var windowWidth = wx.getSystemInfoSync().windowWidth; // 屏幕宽度
        that.setData({
          length: length,
          windowWidth: windowWidth,
          space: windowWidth,
        });
        that.scrollling(); // 第一个字消失后立即从右边出现
      });
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    text: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    step: 2, // 滚动速度
    distance: 360, // 初始滚动距离
    space: 300,
    interval: 20, // 时间间隔
  },

  /**
   * 组件的方法列表
   */
  methods: {
    scrollling() {
      var that = this;
      var length = that.data.length; // 滚动文字的宽度
      var interval = setInterval(function () {
        var maxscrollwidth = length + that.data.space;
        var left = that.data.distance;
        if (left < maxscrollwidth) {
          // 判断是否滚动到最大宽度
          that.setData({
            distance: left + that.data.step,
          });
        } else {
          that.setData({
            distance: 0, // 直接重新滚动
          });
          clearInterval(interval);
          that.scrollling();
        }
      }, that.data.interval);
    },
  },
});
