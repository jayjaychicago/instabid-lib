"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstaBid = void 0;
var _depthTable = require("./depth-table");
var _instaForm = require("./insta-form");
const InstaBid = _ref => {
  let {
    exchange,
    product,
    user
  } = _ref;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(_depthTable.DepthTable, {
    exchange: exchange,
    product: product,
    user: user
  }), /*#__PURE__*/React.createElement(_instaForm.InstaForm, {
    exchange: exchange,
    product: product,
    user: user
  }));
};
exports.InstaBid = InstaBid;