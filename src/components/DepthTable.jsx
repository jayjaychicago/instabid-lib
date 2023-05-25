import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";

import { updateSortedOrders } from "../util";

const EVENT_NAME = "DEPTHUPDATE";
//const CHANNEL_NAME = "Insta@prod";

export function DepthTable({ exchange, product, user, devModeApiKey, apiProxy, onSelect }) {
  const [buys, setBuys] = useState([]);
  const [sells, setSells] = useState([]);
  const [pusher, setPusher] = useState(undefined);

 /* useEffect(() => {
    setPusher(
      new Pusher("122f17b065e8921fa6e0", {
        cluster: "us2", channelAuthorization: { endpoint: "/api/pusherAuth"}
      })
    );
  }, []); */

    useEffect(() => {
    setPusher(
      new Pusher("122f17b065e8921fa6e0", {
        cluster: "us2"
      })
    );
  }, []); 



  useEffect(() => {
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
      let apiProxyGetValue = `https://api.instabid.io/depth?exchange=${exchange}&product=${product}&user=${user}`
      console.log("API Proxy value seen for depthGet " + apiProxy)
      try { 
          if ((apiProxy == undefined) || (apiProxy == "")) {
              console.log("using default API proxy")                            
          } else {
              apiProxyGetValue = apiProxy + "?type=depthGet&exchange=" + `${exchange}&product=${product}&user=${user}`
          }
          const res = await fetch(apiProxyGetValue);
          handleData(await res.json());
        } catch(e)
        {
            console.error("Problem getting depths ",e)
      }

      //const channel = pusher.subscribe(CHANNEL_NAME);
      //const channel = pusher.subscribe("private-" + exchange + "@" + product);
      // TOO COMPLEX FOR NOW. WILL ADD LATER
      const channel = pusher.subscribe(exchange + "@" + product);
      channel.bind(EVENT_NAME, handleData);

      return () => {
        channel.unbind(EVENT_NAME);
      };
    })();
  }, [pusher]);

  function handleData(data) {
    console.log("Received a depth update via Pusher: " + JSON.stringify(data));
    let orderedSells = data.sells;
    let orderedBuys = data.buys;
    if (orderedBuys.length > 0) {
      setBuys((prev) => updateSortedOrders(prev, orderedBuys));
    }
    if (orderedSells.length > 0) {
      setSells((prev) => updateSortedOrders(prev, orderedSells));
    }
  }

  DepthTable.defaultProps = {
    onSelect: () => {}
};

  return (
    <div className="h-100 d-flex align-items-center justify-content-center">
      <div id="sells">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Bids</th>
              <th scope="col">Bid Price</th>
              <th scope="col">Sale Price</th>
              <th scope="col">Qty for sale</th>
            </tr>
          </thead>
          <tbody>
            {sells
              .filter((order) => order.qty)
              .map((order, i) => (
                <tr key={i} onClick={() => onSelect && typeof onSelect === 'function' && onSelect({ side: 'B', ...order })}>
                  <td className="table-data text-center">&nbsp;</td>
                  <td className="table-data text-center">&nbsp;</td>
                  <td className="table-data text-center">${order.price}</td>
                  <td className="table-data text-center">{order.qty}</td>
                </tr>
              ))}
            {buys
              .filter((order) => order.qty)
              .map((order, i) => (
                <tr key={i} onClick={() => onSelect && typeof onSelect === 'function' && onSelect({ side: 'S', ...order })}>
                  <td className="table-data text-center">{order.qty}</td>
                  <td className="table-data text-center">${order.price}</td>
                  <td className="table-data text-center">&nbsp;</td>
                  <td className="table-data text-center">&nbsp;</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}