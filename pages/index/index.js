// pages/index/index.js
const defaultAvatarUrl =
  "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: defaultAvatarUrl,
    messageboxClass: "messageboxHidden",
    nickname: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  getUserProfile() {
    wx.login({
      success: (res) => {
        var code = res.code;
        wx.request({
          url: `https://api.weixin.qq.com/sns/jscode2session?appid=wxe80347aec62e571a&secret=09ff2b5a7eda8a3b0305aefc078980c5&js_code=${code}&grant_type=authorization_code`,
          success: (res) => {
            openid = res.data.openid;
            //获取到你的openid
            wx.setStorageSync("openid", openid);
          },
        });
      },
    });
    let user = {
      nickName: this.data.nickname,
      avatarUrl: this.data.avatarUrl,
    };
    wx.setStorageSync("user", user);
    wx.switchTab({
      url: "/pages/game/game",
    });
  },

  showMessage() {
    this.setData({
      messageboxClass: "messagebox",
    });
  },

  onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    this.setData({
      avatarUrl,
    });
  },

  onChooseName(e) {
    const name = e.detail.value;
    this.setData({
      nickname: name,
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
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
