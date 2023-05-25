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
    const pusherInstance = new Pusher("122f17b065e8921fa6e0", {
      cluster: "us2",
      authEndpoint: 'https://api.instabid.io/pusher/', 
    });

    const handleConnected = async () => {
      console.log("#### BEFORE PUSHER PROXY", apiProxy)
      if ((apiProxy == undefined) || apiProxy == "") {
        apiProxy = "https://api.instabid.io/pusher/&apiKey=" + devModeApiKey;  
      }
      else {
        apiProxy = apiProxy + "/?type=pusher"
      }

      console.log("####### Trying to get pusher auth from ",`${apiProxy}&socket_id=${pusherInstance.connection.socket_id}&exchange=${exchange}&product=${product}`)
      const res = await fetch(`${apiProxy}&socket_id=${pusherInstance.connection.socket_id}&exchange=${exchange}&product=${product}`);
      
      if (res.status != 200) {
        console.log("Did not get auth for Pusher!")
      } else {
        const data = await res.json();
        console.log("Got auth from pusher", data.auth)
        console.log("Setting auth...");
      
        // Subscribe to the channel here with the auth info.
        const channel = pusherInstance.subscribe({
          channel: 'private-' + exchange + '@' + product,
          auth: {
            headers: {
              'Authorization': `Bearer ${data.auth}` // Use the token returned by the Lambda function
            }
          }
        });
      
        console.log("!!!Auth set", pusherInstance.config.auth);
        setPusher(pusherInstance);
        console.log("Pusher instance set in state");
      }
      
      setPusher(pusherInstance);
      console.log("!Pusher instance set in state");
    };

    pusherInstance.connection.bind('connected', handleConnected);

    pusherInstance.connection.bind('error', function(err) {
      console.log('Error from Pusher:', err);
    });
  
    return () => {
      pusherInstance.connection.unbind('connected', handleConnected);
      pusherInstance.disconnect();
    };
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
