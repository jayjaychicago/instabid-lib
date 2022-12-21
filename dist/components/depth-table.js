"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DepthTable = DepthTable;
var _react = require("react");
var Pusher = _interopRequireWildcard(require("pusher-js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
const EVENT_NAME = "DEPTHUPDATE";
//const CHANNEL_NAME = "Insta@prod";

function DepthTable(_ref) {
  let {
    exchange,
    product,
    user
  } = _ref;
  const [buys, setBuys] = (0, _react.useState)([]);
  const [sells, setSells] = (0, _react.useState)([]);
  const [pusher, setPusher] = (0, _react.useState)(undefined);
  (0, _react.useEffect)(() => {
    setPusher(new Pusher("122f17b065e8921fa6e0", {
      cluster: "us2"
    }));
  }, []);
  (0, _react.useEffect)(() => {
    if (!pusher) return;
    (async () => {
      if (exchange === undefined) {
        exchange = "Insta";
      }
      if (product === undefined) {
        product = "prod";
      }
      if (user === undefined) {
        user = "julien";
      }
      const res = await fetch("https://api.instabid.io/depth?exchange=" + exchange + "&product=" + product + "&user=" + user);
      handleData(await res.json());

      //const channel = pusher.subscribe(CHANNEL_NAME);
      const channel = pusher.subscribe(exchange + "@" + product);
      channel.bind(EVENT_NAME, handleData);
      return () => {
        channel.unbind(EVENT_NAME);
      };
    })();
  }, [pusher]);
  function handleData(_ref2) {
    let {
      sells,
      buys
    } = _ref2;
    console.dir({
      sells,
      buys
    });
    if (buys.length > 0) setBuys(prev => update(prev, buys).sort((a, b) => b.price - a.price));
    if (sells.length > 0) setSells(prev => update(prev, sells).sort((a, b) => b.price - a.price));
  }
  function update(a, orders) {
    if (orders.find(_order => a.find(order => order.price === _order.price))) {
      return a.flatMap(_order => orders.map(order => {
        console.dir(order.price === _order.price);
        return order.price === _order.price ? order : _order;
      }));
    }
    return [...a, ...orders];
  }
  return /*#__PURE__*/React.createElement("div", {
    class: "h-100 d-flex align-items-center justify-content-center"
  }, /*#__PURE__*/React.createElement("div", {
    id: "sells"
  }, /*#__PURE__*/React.createElement("table", {
    class: "table table-hover"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Bids"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Bid Price"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Sale Price"), /*#__PURE__*/React.createElement("th", {
    scope: "col"
  }, "Qty for sale"))), /*#__PURE__*/React.createElement("tbody", null, sells.filter(order => order.qty).map((order, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, "\xA0"), /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, "\xA0"), /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, "$", order.price), /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, order.qty))), buys.filter(order => order.qty).map((order, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, order.qty), /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, "$", order.price), /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, "\xA0"), /*#__PURE__*/React.createElement("td", {
    className: "table-data text-center"
  }, "\xA0")))))));
}