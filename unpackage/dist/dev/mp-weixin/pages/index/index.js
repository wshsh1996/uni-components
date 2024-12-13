"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const functionList = [
      {
        name: "录音",
        path: "/pages/common/recording"
      }
    ];
    const toFunction = (path) => {
      common_vendor.index.navigateTo({
        url: path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(functionList, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: index,
            c: common_vendor.o(($event) => toFunction(item.path), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
