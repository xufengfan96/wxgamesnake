// custom-tab-bar/index.js
import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../store/store";
Component({
  options: {
    options: {
      styleIsolation: "shared",
    },
  },
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: {
      active: "activeTabbarIndex",
    },
    actions: {
      updateActive: "updateActiveTabbarIndex",
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    active: 0,
    list: [
      {
        pagePath: "../game/game",
        text: "游戏",
        iconPath: "https://img.yzcdn.cn/vant/user-inactive.png",
        selectedIconPath: "https://img.yzcdn.cn/vant/user-active.png",
      },
      {
        pagePath: "../store/store",
        text: "商店",
        iconPath: "https://img.yzcdn.cn/vant/user-inactive.png",
        selectedIconPath: "https://img.yzcdn.cn/vant/user-active.png",
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      // event.detail 的值为当前选中项的索引
      // this.setData({ active: event.detail });
      this.updateActive(event.detail);
      wx.switchTab({
        url: this.data.list[event.detail].pagePath,
      });
    },
  },
});
