// pages/store/store.js
import Dialog from "@vant/weapp/dialog/dialog";
import {
  createStoreBindings,
  storeBindingsBehavior,
} from "mobx-miniprogram-bindings";
import { store } from "../../store/store";
import Notify from "@vant/weapp/notify/notify";

const app = getApp();
const userInfo = wx.getStorageSync("user");
const openid = wx.getStorageSync("openid");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyValue: "",
    list: [],
    allItemList: [],
    showReport: false,
    exchangeReport: {},
    text: "需要滚动的字幕",
    step: 2, // 滚动速度
    distance: 360, // 初始滚动距离
    space: 300,
    interval: 20, // 时间间隔
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: {
        //钻石获取总共，store里做一次请求？
        diamondNum: "diamondNum",
      },
      actions: {
        getInitialDiamondNum: "getInitialDiamondNum",
        reduceDiamondNum: "reduceDiamondNum",
      },
    });
    this.init();
  },

  init() {
    this.getGoodsList();
    this.getGoodsListById();
    this.getInitialDiamondNum();
  },

  getGoodsList() {
    let url = app.globalData.URL + "/goods/get";
    wx.request({
      //获取商品表单
      url: url, //仅为示例，并非真实的接口地址
      method: "GET",
      data: {
        page: 20, //每页条数？
        size: 5,
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      success: (res) => {
        let list = JSON.parse(JSON.stringify(res.data.data));
        let length = list.length;
        for (let i = length - 1; i >= 0; i--) {
          let item = list[i];
          if (!item.upper) {
            list.splice(i, 1);
          }
        }
        this.setData({
          allItemList: res.data.data,
          list: list,
        });
      },
    });
  },

  getGoodsListById() {
    let userUrl = app.globalData.URL + "/goods/getByUid";
    wx.request({
      //获取商品表单
      url: userUrl, //仅为示例，并非真实的接口地址
      method: "GET",
      data: {
        userId: openid,
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      success: (res) => {
        let exchangeMap = new Map();
        res.data.data.forEach((item) => {
          if (exchangeMap.has(item.goodsName)) {
            exchangeMap.set(
              item.goodsName,
              {
                goodsName: item.goodsName,
                imgUrl: item.imgUrl,
                exchangeNum: exchangeMap.get(item.goodsName).exchangeNum + 1,
              }
              // exchangeMap.get(item.goodsName) + 1
            );
          } else {
            exchangeMap.set(item.goodsName, {
              goodsName: item.goodsName,
              imgUrl: item.imgUrl,
              exchangeNum: 1,
            });
          }
        });
        let exchanegAarray = new Array();
        for (let exchangeItem of exchangeMap.values()) {
          exchanegAarray.push(exchangeItem);
        }
        this.setData({
          exchangeReport: exchanegAarray,
        });
      },
    });
  },
  // 关键词搜索
  changeKeyValue(event) {
    var search = new RegExp(event.detail, "g");
    let list = JSON.parse(JSON.stringify(this.data.allItemList));
    let length = list.length;
    for (let i = length - 1; i >= 0; i--) {
      let item = list[i];
      if (item.goodsName.search(search) === -1) {
        list.splice(i, 1);
      }
    }
    this.setData({
      list: list,
    });
  },
  // 兑换产品
  exchange(event) {
    let allItemList = this.data.allItemList;
    let item;
    for (let i = 0; i < allItemList.length; i++) {
      if (allItemList[i].goodsName == event.currentTarget.id) {
        item = allItemList[i];
        break;
      }
    }
    Dialog.confirm({
      title: "提示",
      message: "确认兑换产品？",
    }).then(() => {
      let url =
        app.globalData.URL +
        "/goods/add/userGoods?userId=" +
        openid +
        "&goodsName=" +
        item.goodsName;
      wx.request({
        //获取提交当前数据
        url: url, //仅为示例，并非真实的接口地址
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded",
        },
        success: (res) => {
          if (res.data.code !== 0) {
            Notify({ type: "danger", message: res.data.msg });
          } else {
            Notify({ type: "success", message: "兑换成功" });
          }
          this.init();
        },
      });
    });
  },

  showExchangeReport() {
    this.setData({
      showReport: true,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.onRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},

  onRefresh() {
    //导航条加载动画
    wx.showNavigationBarLoading();
    //loading 提示框
    wx.showLoading({
      title: "Loading...",
    });
    this.init();
    setTimeout(function () {
      wx.hideLoading();
      wx.hideNavigationBarLoading();
      //停止下拉刷新
      wx.stopPullDownRefresh();
    }, 1000);
  },
});
