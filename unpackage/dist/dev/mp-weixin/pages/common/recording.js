"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (record + chatRecord)();
}
const record = () => "../../components/record.js";
const chatRecord = () => "../../components/chatRecord.js";
const _sfc_main = {
  __name: "recording",
  setup(__props) {
    common_vendor.index.getRecorderManager();
    common_vendor.index.createInnerAudioContext();
    const type = common_vendor.ref("base");
    common_vendor.reactive({
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => type.value = "base"),
        b: common_vendor.o(($event) => type.value = "chat"),
        c: type.value === "base"
      }, type.value === "base" ? {} : {}, {
        d: type.value === "chat"
      }, type.value === "chat" ? {} : {});
    };
  }
};
wx.createPage(_sfc_main);
