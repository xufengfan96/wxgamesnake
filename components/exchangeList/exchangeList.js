// components/rankList/rankList.js
Component({
  lifetimes: {},
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    showList: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: 1,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    close() {
      this.setData({
        show: false,
      });
    },
  },

  observers: {},
});
