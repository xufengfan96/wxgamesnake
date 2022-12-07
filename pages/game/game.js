// index.js
// 获取应用实例
import Music from "../../plugin/music";
import {
  createStoreBindings,
  storeBindingsBehavior,
} from "mobx-miniprogram-bindings";
import { store } from "../../store/store";
let music = new Music();
let food = new Map();
let get_num = 0;

const app = getApp();
const userInfo = wx.getStorageSync("user");
const openid = wx.getStorageSync("openid");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    gameStart: false, // 游戏是否开始
    appleNum: 0, //获得苹果数量
    isMaxActive: false,
    rows: 28, // 操场行数
    cols: 22, // 操场列数
    ground: [[]], // 操场方块位置 ground的值 0是空地 1是蛇头 2是蛇身体 3是苹果 4是钻石
    snake: "", // 贪吃蛇的位置
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    flag: 0, // 当前贪吃蛇移动的方向，0 右，1 下，2 左， 3 上
    musicOn: true,
    show: false,
    rankList: [],

    timer: null,
    modaleHidden: true, //不知道干嘛用的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("game", userInfo);
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: {
        //钻石获取总共，store里做一次请求？
        diamondNum: "diamondNum",
        maxScore: "maxScore",
      },
      actions: {
        eatDiamondNum: "updateDiamondNum",
        getInitialDiamondNum: "getInitialDiamondNum",
      },
    });
    this.init();
  },

  init: function () {
    this.getInitialDiamondNum();
    this.initGround(this.data.rows, this.data.cols); // 初始化操场 [row * col]的零矩阵
    //历史最高得分获取
    this.setData({
      appleNum: 0,
    });
  },

  getRankList: function () {
    let url = app.globalData.URL + "/user/getRank";
    wx.request({
      //获取提交当前数据
      url: url, //仅为示例，并非真实的接口地址
      method: "GET",
      data: {
        // city: city,
        city: "hangzhou",
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      success: (res) => {
        this.setData({
          rankList: res.data.data,
        });
      },
    });
  },

  onShow: function () {
    this.init();
    if (this.data.musicOn) {
      music.playBgm();
    }
  },

  onHide: function () {
    music.stopBgm();
    this.init();
    this.setData({
      modaleHidden: false,
      gameStart: false,
    });
  },

  goStart: function () {
    this.setData({
      gameStart: true,
    });
    food = new Map();
    get_num = 0;
    this.init(); //地图初始化，读取缓存值
    this.initSnake(3); // 初始化贪吃蛇位置
    this.initFood(); // 初始化food
    this.move(3);
  },

  /**
   * 初始化操场
   */
  initGround: function (rows, cols) {
    this.data.ground = new Array(rows).fill([]);
    for (let i = 0; i < rows; i++) {
      this.data.ground[i] = new Array(cols).fill(0);
    }
    this.setData({
      ground: this.data.ground,
    });
  },

  /**
   * 初始化贪吃蛇
   */
  initSnake: function (n) {
    if (n === 0) return;
    this.data.snake = [];
    for (let i = 14 + n; i > 14; i--) {
      if (i === 15) {
        this.data.ground[i][11] = 1; //蛇头标记为1
      } else {
        this.data.ground[i][11] = 2; //蛇身标记为2
      }
      this.data.snake.push([i, 11]); //蛇头是snake[len-1]，蛇尾是snake[0]
    }
    this.setData({
      ground: this.data.ground,
      snake: this.data.snake,
    });
  },

  /**
   * 初始化food 存在偶然事件 出现ground中记录5颗食物，但food中仅记录4颗
   */
  initFood: function () {
    while (food.size < 4) {
      let row = Math.floor(Math.random() * this.data.rows);
      while (food.has(row)) {
        row = Math.floor(Math.random() * this.data.rows);
      }
      let col = Math.floor(Math.random() * this.data.cols);
      var ground = this.data.ground;
      if (ground[row][col] === 0) {
        get_num++;
        if (get_num % 10 === 0) {
          ground[row][col] = 4;
        } else {
          ground[row][col] = 3;
        }
        food.set(row, col);
      }
    }
    this.setData({
      ground: ground,
    });
  },

  /**
   * 判断鼠标滑动方向
   */
  touchStart: function (event) {
    this.data.startX = event.touches[0].pageX;
    this.data.startY = event.touches[0].pageY;
  },

  touchMove: function (event) {
    this.data.endX = event.touches[0].pageX;
    this.data.endY = event.touches[0].pageY;
  },

  touchEnd: function (event) {
    let tX = this.data.endX ? this.data.endX - this.data.startX : 0;
    let tY = this.data.endY ? this.data.endY - this.data.startY : 0;
    if (!this.data.gameStart) {
      return false;
    }
    if (tY < 0 && Math.abs(tX) <= Math.abs(tY) && this.data.flag !== 1) {
      // 向上滑动
      this.data.flag = 3;
    } else if (tY > 0 && Math.abs(tX) <= Math.abs(tY) && this.data.flag !== 3) {
      // 向下滑动
      this.data.flag = 1;
    } else if (tX < 0 && Math.abs(tX) > Math.abs(tY) && this.data.flag !== 0) {
      // 向左滑动
      this.data.flag = 2;
    } else if (tX > 0 && Math.abs(tX) > Math.abs(tY) && this.data.flag !== 2) {
      // 向右滑动
      this.data.flag = 0;
    }
    if (this.data.modaleHidden) {
      this.move(this.data.flag);
    }
  },
  /**
   * snake 移动
   */
  move: function (state) {
    clearInterval(this.data.timer);
    var that = this;
    var speed = 10 * (30 - get_num) > 100 ? 10 * (30 - get_num) : 100;
    that.data.timer = setInterval(function () {
      that.moveDirection(state);
    }, speed);
    this.setData({
      flag: state,
    });
  },

  moveDirection: function (direction) {
    var snakeArr = this.data.snake;
    var snakeLen = snakeArr.length;
    var snakeHead = snakeArr[snakeLen - 1];
    var snakeTail = snakeArr[0];
    var ground = this.data.ground;
    var appleNum = this.data.appleNum;
    var x = 0;
    var y = 0;
    for (var i = 0; i < snakeLen - 1; i++) {
      snakeArr[i] = snakeArr[i + 1]; // 尾巴跟随
    }
    switch (direction) {
      case 0:
        // right: 0
        x = snakeHead[0];
        y = snakeHead[1] + 1;
        break;
      case 1:
        // bottom: 1
        x = snakeHead[0] + 1;
        y = snakeHead[1];
        break;
      case 2:
        // left: 2
        x = snakeHead[0];
        y = snakeHead[1] - 1;
        break;
      case 3:
        // top: 3
        x = snakeHead[0] - 1;
        y = snakeHead[1];
        break;
      default:
        break;
    }

    //判断有没有撞墙
    if (y >= this.data.cols || x >= this.data.rows || y < 0 || x < 0) {
      this.gameOver();
      return;
    }
    //判断有没有咬自己
    if (ground[x][y] === 2) {
      this.gameOver();
      return;
    }
    //判断吃苹果还是钻石
    switch (ground[x][y]) {
      case 3:
        appleNum += 1;
        music.playEat();
        break;
      case 4:
        this.eatDiamondNum();
        music.playDiamond();
        break;
      default:
        break;
    }
    snakeArr[snakeLen - 1] = [x, y];
    ground[snakeHead[0]][snakeHead[1]] = 2;
    ground[x][y] = 1;
    ground[snakeTail[0]][snakeTail[1]] = 0;
    this.setData({
      snake: snakeArr,
      ground: ground,
      appleNum: appleNum,
    });
    this.checkGame(snakeTail, [x, y]); // 检查是否gameover
  },

  /**
   * 检查gameover
   * 撞墙 - gameover，弹出框提示是否重新开始，重新load
   * 自己撞到自己 - gameover
   * 吃到食物 - snake身体变长，重新生成食物
   */
  checkGame: function (snakeTail, snakeHead) {
    // 判断有没有撞墙
    if (
      (snakeHead[0] >= 0) &
      (snakeHead[0] < this.data.rows) &
      (snakeHead[1] >= 0) &
      (snakeHead[1] < this.data.cols)
    ) {
      let modaleHidden = this.data.modaleHidden;
      modaleHidden = true;
      this.collisionSnakeFood(snakeTail, snakeHead, food);
      this.setData({
        modaleHidden: modaleHidden,
      });
    } else {
      this.gameOver();
      return;
    }
  },

  // 撞到食物，游戏继续
  collisionSnakeFood: function (tail, head, food) {
    //head是新头部，也就是食物点位置
    let snake = this.data.snake;
    let ground = this.data.ground;

    if (food.has(head[0])) {
      if (food.get(head[0]) === head[1]) {
        ground[head[0]][head[1]] = 1;
        snake.unshift(tail);
        ground[tail[0]][tail[1]] = 2;
        food.delete(head[0]);
        this.initFood();
        this.setData({
          snake: snake,
          ground: ground,
        });
      }
    }
  },

  // 游戏结束
  gameOver: function () {
    clearInterval(this.data.timer);
    let _that = this;
    this.setData({
      modaleHidden: false,
      timer: null,
    });
    //游戏结束 更新用户分数
    let url = app.globalData.URL + "/user/update";
    wx.request({
      //获取提交当前数据
      url: url, //仅为示例，并非真实的接口地址
      method: "POST",
      data: {
        userID: openid,
        username: userInfo.nickName,
        imgUrl: userInfo.avatarUrl,
        // city: userInfo.city,
        city: "hangzhou",
        diamondNum: this.data.diamondNum,
        maxScore: this.data.appleNum,
      },
      header: {
        "content-type": "application/json", // 默认值
      },
      success: (res) => {
        console.log("结束", res.data);
      },
    });
    wx.showModal({
      title: "游戏失败",
      content: "点击确定，重新开始新一局游戏；点击取消，返回首页",
      success: function (res) {
        if (res.confirm) {
          food = new Map();
          _that.setData({
            ground: [[]],
            gameStart: false, // 游戏是否开始
            snake: "", // 贪吃蛇的位置
            modaleHidden: true,
          });
          _that.init();
        }
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  musicChange: function () {
    let musicOn = this.data.musicOn;
    if (musicOn) {
      music.stopBgm();
    } else {
      music.playBgm();
    }
    this.setData({
      musicOn: !musicOn,
    });
  },

  showRankList: function () {
    this.getRankList();
    // 前端做一次匹配查找
    this.setData({
      show: true,
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.storeBindings.destroyStoreBindings();
  },
});
