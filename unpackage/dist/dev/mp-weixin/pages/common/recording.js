"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "recording",
  setup(__props) {
    let recorderManager = common_vendor.index.getRecorderManager();
    const innerAudioContext = common_vendor.index.createInnerAudioContext();
    let init;
    const state = common_vendor.reactive({
      time: 0,
      //录音时长
      duration: 6e5,
      //录音最大值ms 600000/10分钟
      tempFilePath: "",
      //音频路径
      status: 0,
      //录音状态 0:未开始录音 1:正在录音 2:暂停录音 3:已完成录音
      playStatus: 0
      //录音播放状态 0:未播放 1:正在播放 2:暂停播放
    });
    const kaishi = () => {
      clearInterval(init);
      recorderManager.onStop((res) => {
        console.log("recorder stop", res);
        state.tempFilePath = res.tempFilePath;
        state.status = 3;
        recordingTimer(state.time);
      });
      const options = {
        duration: state.duration,
        //指定录音的时长，单位 ms
        sampleRate: 16e3,
        //采样率
        numberOfChannels: 1,
        //录音通道数
        encodeBitRate: 96e3,
        //编码码率
        format: "mp3",
        //音频格式，有效值 aac/mp3
        frameSize: 10
        //指定帧大小，单位 KB
      };
      recordingTimer();
      recorderManager.start(options);
      recorderManager.onStart((res) => {
        state.status = 1;
        console.log("recorder start", res);
        console.log(state.status, "status");
      });
    };
    const zanting = () => {
      console.log("zanting");
      recorderManager.onPause(() => {
        console.log("recorder pause");
        state.status = 2;
      });
      recordingTimer(state.time);
      recorderManager.pause();
    };
    const jixu = () => {
      state.status = 1;
      recordingTimer();
      recorderManager.resume();
    };
    const tingzhi = () => {
      recorderManager.onStop((res) => {
        console.log("recorder stop", res);
        state.tempFilePath = res.tempFilePath;
        state.status = 3;
      });
      recordingTimer(state.time);
      recorderManager.stop();
    };
    const bofang = () => {
      console.log(state.tempFilePath);
      innerAudioContext.src = state.tempFilePath;
      if (state.playStatus == 0) {
        state.playStatus = 1;
        innerAudioContext.play();
      }
      innerAudioContext.onEnded(() => {
        innerAudioContext.stop();
        state.playStatus = 0;
      });
    };
    const recordingTimer = (time) => {
      if (time == void 0) {
        init = setInterval(() => {
          state.time = state.time + 1;
        }, 1e3);
        console.log(init, "init");
      } else {
        clearInterval(init);
        console.log("暂停计时");
      }
    };
    const reset = () => {
      common_vendor.index.showModal({
        title: "重新录音",
        content: "是否重新录制?",
        success(res) {
          if (res.confirm) {
            state.time = 0;
            state.tempFilePath = "";
            state.status = 0;
            state.playStatus = 0;
            innerAudioContext.stop();
          }
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(state.status == 0 ? "录音时长" : state.status == 3 ? "录音已完成" : "正在录音中"),
        b: common_vendor.t(state.time),
        c: common_vendor.n(state.status == 3 ? "show" : "hide"),
        d: common_vendor.o(reset),
        e: common_vendor.t(state.playStatus == 1 ? "录音播放中" : "播放录音"),
        f: common_vendor.n(state.status == 3 && state.playStatus == 0 ? "show" : "hide"),
        g: common_vendor.o(bofang),
        h: common_vendor.t(state.duration / 1e3),
        i: common_vendor.t(state.duration / 6e4),
        j: state.time * (100 / (_ctx.duration / 1e3)),
        k: common_vendor.n(state.status == 0 ? "row" : "no-clicking"),
        l: common_vendor.o(kaishi),
        m: common_vendor.n(state.status == 1 ? "row" : "no-clicking"),
        n: common_vendor.o(zanting),
        o: common_vendor.n(state.status == 2 ? "row" : "no-clicking"),
        p: common_vendor.o(jixu),
        q: common_vendor.n(state.status == 1 || state.status == 2 ? "row" : "no-clicking"),
        r: common_vendor.o(tingzhi)
      };
    };
  }
};
wx.createPage(_sfc_main);
