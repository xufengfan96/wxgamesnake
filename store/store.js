import { observable, action } from "mobx-miniprogram";

const app = getApp();
const userInfo = wx.getStorageSync("user");
const openid = wx.getStorageSync("openid");

export const store = observable({
  diamondNum: 0,
  maxScore: 0,
  activeTabbarIndex: 0,
  //actions 方法，用来修改store中的数据
  updateActiveTabbarIndex: action(function (index) {
    this.activeTabbarIndex += index;
  }),

  getInitialDiamondNum: action(function () {
    let url = app.globalData.URL + "/user/get";
    wx.request({
      //获取商品表单
      url: url, //仅为示例，并非真实的接口地址
      method: "GET",
      data: {
        userId: openid,
        username: userInfo.nickName,
        // city: userInfo.city,
        city: "hangzhou",
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      success: (res) => {
        this.diamondNum = res.data.data.diamondNum;
        this.maxScore = res.data.data.maxScore;
      },
    });
  }),

  updateDiamondNum: action(function () {
    this.diamondNum++;
  }),

  // reduceDiamondNum: action(function (userId, goodsName) {
  //   let url =
  //     app.globalData.URL +
  //     "/goods/add/userGoods?userId=" +
  //     userId +
  //     "&goodsName=" +
  //     goodsName;
  //   wx.request({
  //     //获取提交当前数据
  //     url: url, //仅为示例，并非真实的接口地址
  //     method: "POST",
  //     header: {
  //       "content-type": "application/x-www-form-urlencoded",
  //     },
  //     success: (res) => {
  //       console.log(res);
  //       if (res.data.code === 0) {
  //         console.log("兑换成功");
  //       } else {
  //         throw new Error(res.data.msg);
  //       }
  //     },
  //   });
  // }),
});
