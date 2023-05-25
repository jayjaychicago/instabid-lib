import React, { useState, useEffect } from "react";
import Pusher from "pusher-js";

import { updateSortedOrders } from "../util";

const EVENT_NAME = "DEPTHUPDATE";
//const CHANNEL_NAME = "Insta@prod";

export function DepthTable({ exchange, product, user, devModeApiKey, apiProxy, onSelect }) {
  const [buys, setBuys] = useState([]);
  const [sells, setSells] = useState([]);
  const [pusher, setPusher] = useState(undefined);

  console.log("LIB DepthTable has apiProxy= ", apiProxy)

  useEffect(() => {
    const initializePusher = async () => {
      // Construct API endpoint
      let apiProxyTemp = apiProxy;
      if (!apiProxyTemp || apiProxyTemp === "") {
        apiProxyTemp = "https://api.instabid.io/pusher/&apiKey=" + devModeApiKey;
      } else {
        apiProxyTemp = apiProxyTemp + "/?type=pusher";
      }
      
      const socketIdEndpoint = `${apiProxyTemp}&exchange=${exchange}&product=${product}`;
  
      // Fetch token
      const res = await fetch(socketIdEndpoint);
      let data;
      if (res.status !== 200) {
        console.log("Did not get auth for Pusher!");
      } else {
        data = await res.json();
        console.log("Got auth from pusher", data.auth);
      }
  
      // Initialize Pusher with fetched token
      const pusherInstance = new Pusher("122f17b065e8921fa6e0", {
        cluster: "us2",
        auth: {
          headers: {
            'Authorization': `Bearer ${data?.auth}`,
          },
        },
      });
  
      const handleConnected = async () => {
        // Rest of your connected handler logic
        // ...
        setPusher(pusherInstance);
        console.log("Pusher instance set in state");
      };
  
      pusherInstance.connection.bind('connected', handleConnected);
  
      pusherInstance.connection.bind('error', function(err) {
        console.log('Error from Pusher:', err);
      });
  
      return () => {
        pusherInstance.connection.unbind('connected', handleConnected);
        pusherInstance.disconnect();
      };
    };
  
    initializePusher();
  }, []);
  

  

  useEffect(() => {
    if (!pusher) return;

    const handleSubscriptionSucceeded = () => {
      console.log('!!! Successfully subscribed!');
    };

    const handleSubscriptionError = (statusCode) => {
      console.log("!!! Subscription error with status code ", statusCode);
    };

    const handleStateChange = (states) => {
      console.log('!!! Pusher connection state is now: ', states.current);
    };

    const handleData = (data) => {
      console.log("!!!Received a depth update via Pusher: " + JSON.stringify(data));
      let orderedSells = data.sells;
      let orderedBuys = data.buys;
      if (orderedBuys.length > 0) {
        setBuys((prev) => updateSortedOrders(prev, orderedBuys));
      }
      if (orderedSells.length > 0) {
        setSells((prev) => updateSortedOrders(prev, orderedSells));
      }
    };

    pusher.connection.bind('state_change', handleStateChange);

    const channel = pusher.subscribe("private-" + exchange + "@" + product);
    channel.bind('pusher:subscription_succeeded', handleSubscriptionSucceeded);
    channel.bind('pusher:subscription_error', handleSubscriptionError);
    channel.bind(EVENT_NAME, handleData);

    return () => {
      channel.unbind('pusher:subscription_succeeded', handleSubscriptionSucceeded);
      channel.unbind('pusher:subscription_error', handleSubscriptionError);
      channel.unbind(EVENT_NAME, handleData);
      pusher.connection.unbind('state_change', handleStateChange);
    };
  }, [pusher]);




  

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
