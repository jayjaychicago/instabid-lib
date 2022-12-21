"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstaBid = void 0;
var _react = _interopRequireDefault(require("react"));
var _depthTable = require("./depth-table");
var _instaForm = require("./insta-form");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const InstaBid = _ref => {
  let {
    exchange,
    product,
    user
  } = _ref;
  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_depthTable.DepthTable, {
    exchange: exchange,
    product: product,
    user: user
  }), /*#__PURE__*/_react.default.createElement(_instaForm.InstaForm, {
    exchange: exchange,
    product: product,
    user: user
  }));
};
exports.InstaBid = InstaBid;