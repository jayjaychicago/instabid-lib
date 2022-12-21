"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstaForm = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const InstaForm = _ref => {
  let {
    exchange,
    product,
    user
  } = _ref;
  const isAuthenticated = true;
  const [side, setSide] = (0, _react.useState)("");
  const [qty, setQty] = (0, _react.useState)("");
  const [price, setPrice] = (0, _react.useState)("");
  const [message, setMessage] = (0, _react.useState)("");
  const [buttonState, setButtonState] = (0, _react.useState)(false);
  let handleSubmit = async e => {
    e.preventDefault();
    setButtonState(true);
    try {
      if (exchange == undefined) {
        exchange = "Insta";
      }
      if (product == undefined) {
        product = "prod";
      }
      if (user == undefined) {
        user = "julien";
      }
      let res = await fetch("https://api.instabid.io/order", {
        method: "POST",
        body: JSON.stringify({
          exchange: exchange,
          product: product,
          side: side,
          qty: qty,
          price: price,
          user: user,
          apiKey: "12345"
        })
      });
      let resJson = await res.json();
      if (res.status === 200) {
        //setSide("");
        setButtonState(false);
        setQty("");
        setPrice("");
        //setMessage("Done!");
      } else {
        setMessage("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return isAuthenticated ? /*#__PURE__*/_react.default.createElement("div", {
    className: "InstaForm",
    class: "d-flex justify-content-center"
  }, /*#__PURE__*/_react.default.createElement("form", {
    class: "form-horizontal d-inline-flex p-2",
    onSubmit: handleSubmit
  }, /*#__PURE__*/_react.default.createElement("div", {
    class: "btn-group m-2",
    role: "group",
    "data-toggle": "buttons",
    onChange: e => setSide(e.target.value)
  }, /*#__PURE__*/_react.default.createElement("input", {
    type: "radio",
    class: "btn-check",
    name: "buySell",
    id: "placeBidBuytest",
    value: "B",
    autocomplete: "off"
  }), /*#__PURE__*/_react.default.createElement("label", {
    class: "btn btn-outline-primary",
    for: "placeBidBuytest"
  }, "Buy"), /*#__PURE__*/_react.default.createElement("input", {
    type: "radio",
    class: "btn-check",
    name: "buySell",
    id: "placeBidSelltest",
    value: "S",
    autocomplete: "off"
  }), /*#__PURE__*/_react.default.createElement("label", {
    class: "btn btn-outline-primary",
    for: "placeBidSelltest"
  }, "Sell")), /*#__PURE__*/_react.default.createElement("input", {
    class: "form-control m-2",
    type: "number",
    value: qty,
    placeholder: "Qty",
    onChange: e => setQty(e.target.value)
  }), /*#__PURE__*/_react.default.createElement("div", {
    class: "input-group m-2"
  }, /*#__PURE__*/_react.default.createElement("div", {
    class: "input-group-prepend"
  }, /*#__PURE__*/_react.default.createElement("span", {
    class: "input-group-text"
  }, "$")), /*#__PURE__*/_react.default.createElement("input", {
    class: "form-control",
    type: "number",
    value: price,
    placeholder: "Price",
    onChange: e => setPrice(e.target.value)
  })), /*#__PURE__*/_react.default.createElement("button", {
    disabled: buttonState,
    class: "btn btn-primary btn-sm m-2",
    type: "submit"
  }, "Trade"), /*#__PURE__*/_react.default.createElement("div", {
    className: "message"
  }, message ? /*#__PURE__*/_react.default.createElement("p", null, message) : null))) : /*#__PURE__*/_react.default.createElement("div", null, "This is where you put your authentication process or components");
};
exports.InstaForm = InstaForm;