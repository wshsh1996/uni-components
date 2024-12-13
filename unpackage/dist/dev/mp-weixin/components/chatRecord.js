"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "chatRecord",
  setup(__props) {
    const record = common_vendor.index.getRecorderManager();
    const state = common_vendor.reactive({
      isTalking: false,
      // 是否正在讲话
      sendLock: false,
      // 语音是否发送锁，true-不发送，false-发送（用于上滑取消发送）
      // record: null, // 语音对象
      startPoint: {}
      //记录长按录音开始点信息,用于后面计算滑动距离。
    });
    const onStart = () => {
      const option = {
        format: "mp3"
      };
      console.log("start");
      state.isTalking = true;
      record.start(option);
      record.onStart((res) => {
        console.log("start", res);
      });
      record.onError((res) => {
        console.log("录音错误事件：", res);
      });
    };
    const onEnd = () => {
      state.isTalking = false;
      record.stop();
      record.onStop((res) => {
        console.log(res, "录音回调地址");
        if (state.sendLock) {
          state.sendLock = false;
          console.log("取消发送");
          return;
        }
        if (res.duration < 1e3) {
          common_vendor.index.showToast({
            icon: "error",
            title: "说话时间太短"
          });
          return;
        }
      });
    };
    const touchStart = (e) => {
      state.startPoint.clientX = e.changedTouches[0].clientX;
      state.startPoint.clientY = e.changedTouches[0].clientY;
    };
    const handleRecordMove = (e) => {
      let touchData = e.touches[0];
      touchData.clientX - state.startPoint.clientX;
      let moveY = touchData.clientY - state.startPoint.clientY;
      if (moveY > -45) {
        state.sendLock = false;
      } else {
        state.sendLock = true;
      }
    };
    common_vendor.onLoad(() => {
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !state.isTalking,
        b: state.isTalking,
        c: state.isTalking && !state.sendLock,
        d: common_vendor.n(state.isTalking ? "mic-btn-talking" : "mic-btn"),
        e: common_vendor.o(touchStart),
        f: common_vendor.o(onEnd),
        g: common_vendor.o(onStart),
        h: common_vendor.o(handleRecordMove),
        i: state.isTalking
      }, state.isTalking ? {
        j: common_vendor.f(10, (item, index, i0) => {
          return {
            a: index
          };
        }),
        k: common_vendor.n({
          active: state.sendLock
        })
      } : {}, {
        l: state.isTalking
      }, state.isTalking ? {
        m: state.sendLock,
        n: common_vendor.n({
          active: state.sendLock
        })
      } : {}, {
        o: common_vendor.n({
          "mic-layer-talking": state.isTalking
        })
      });
    };
  }
};
wx.createComponent(_sfc_main);
