"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InstaForm = void 0;
var _react = require("react");
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
  return isAuthenticated ? /*#__PURE__*/React.createElement("div", {
    className: "InstaForm",
    class: "d-flex justify-content-center"
  }, /*#__PURE__*/React.createElement("form", {
    class: "form-horizontal d-inline-flex p-2",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    class: "btn-group m-2",
    role: "group",
    "data-toggle": "buttons",
    onChange: e => setSide(e.target.value)
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    class: "btn-check",
    name: "buySell",
    id: "placeBidBuytest",
    value: "B",
    autocomplete: "off"
  }), /*#__PURE__*/React.createElement("label", {
    class: "btn btn-outline-primary",
    for: "placeBidBuytest"
  }, "Buy"), /*#__PURE__*/React.createElement("input", {
    type: "radio",
    class: "btn-check",
    name: "buySell",
    id: "placeBidSelltest",
    value: "S",
    autocomplete: "off"
  }), /*#__PURE__*/React.createElement("label", {
    class: "btn btn-outline-primary",
    for: "placeBidSelltest"
  }, "Sell")), /*#__PURE__*/React.createElement("input", {
    class: "form-control m-2",
    type: "number",
    value: qty,
    placeholder: "Qty",
    onChange: e => setQty(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    class: "input-group m-2"
  }, /*#__PURE__*/React.createElement("div", {
    class: "input-group-prepend"
  }, /*#__PURE__*/React.createElement("span", {
    class: "input-group-text"
  }, "$")), /*#__PURE__*/React.createElement("input", {
    class: "form-control",
    type: "number",
    value: price,
    placeholder: "Price",
    onChange: e => setPrice(e.target.value)
  })), /*#__PURE__*/React.createElement("button", {
    disabled: buttonState,
    class: "btn btn-primary btn-sm m-2",
    type: "submit"
  }, "Trade"), /*#__PURE__*/React.createElement("div", {
    className: "message"
  }, message ? /*#__PURE__*/React.createElement("p", null, message) : null))) : /*#__PURE__*/React.createElement("div", null, "This is where you put your authentication process or components");
};
exports.InstaForm = InstaForm;