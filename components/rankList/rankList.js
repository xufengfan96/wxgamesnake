// components/rankList/rankList.js
Component({
  lifetimes: {
    attached() {
      this.setData({
        showList: this.data.rankList,
        type: 1,
      });
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    list: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("user"),
    showList: [],
    type: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    changeRank(event) {
      if (event.currentTarget.id === "1") {
        this.setData({
          type: 1,
        });
      } else {
        this.setData({
          type: 2,
        });
      }
    },
    close() {
      this.setData({
        show: false,
      });
    },
  },

  observers: {
    list: function (newList) {
      this.setData({
        showList: newList,
      });
    },
    type: function (newType) {
      if (newType === 1) {
        this.setData({
          // showList: this.data.rankList,
          showList: this.data.list,
        });
      } else {
        this.setData({
          // showList: this.data.exchangeList,
          showList: this.data.list,
        });
      }
    },
  },
});
