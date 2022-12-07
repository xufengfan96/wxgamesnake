let instance;

export default class Music {
  constructor() {
    if (instance) return instance;

    instance = this;

    this.bgmAudio = wx.createInnerAudioContext();
    // 循环播放
    this.bgmAudio.loop = true;
    this.bgmAudio.src = "https://xufengfan96.github.io/static/bgm.mp3";

    // 吃苹果
    this.eatAudio = wx.createInnerAudioContext();
    this.eatAudio.src = "https://xufengfan96.github.io/static/eat.mp3";

    // 死亡
    this.dieAudio = wx.createInnerAudioContext();
    this.dieAudio.src = "https://xufengfan96.github.io/static/die.mp3";

    // 拿钻石
    this.getDiamondAudio = wx.createInnerAudioContext();
    this.getDiamondAudio.src =
      "https://xufengfan96.github.io/static/getDiamond.mp3";
  }

  playBgm() {
    this.bgmAudio.play();
  }

  stopBgm() {
    this.bgmAudio.stop();
  }
  playEat() {
    this.eatAudio.play();
  }

  playDiamond() {
    this.getDiamondAudio.play();
  }
  playDie() {
    this.dieAudio.play();
  }
}
