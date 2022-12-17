import React, { useEffect, useState } from "react"
import * as Pusher from "pusher-js";

const EVENT_NAME = "DEPTHUPDATE";
const CHANNEL_NAME = "Insta@prod";


const InstaTable = () => {
  const [depth, setDepth] = useState([])



  const fetchData = () => {
    fetch("https://api.instabid.io/depth?exchange=Insta&product=prod&user=julien")
      .then(response => {
        return response.json()
      })
      .then(data => {
        setDepth(data)
      })
  }

  useEffect(() => {
    fetchData()

/*    Pusher.logToConsole = true;

    const pusher = new Pusher('122f17b065e8921fa6e0', {
        cluster: 'us2'
    });

    const channel = pusher.subscribe('Insta@prod');
    channel.bind('DEPTHUPDATE', function (data) {
        alert(JSON.stringify(data));
    });*/

  }, [])



  
    const [buys, setBuys] = useState([]);
    const [sells, setSells] = useState([]);
    const [pusher, setPusher] = useState(undefined);
  
    useEffect(() => {
      setPusher(
        new Pusher("122f17b065e8921fa6e0", {
          cluster: "us2",
        })
      );
    }, []);
  
    useEffect(() => {
      if (!pusher) return;
  
      const channel = pusher.subscribe(CHANNEL_NAME);
      channel.bind(EVENT_NAME, handleData);
  
      return () => {
        channel.unbind(EVENT_NAME);
      };
    }, [pusher]);
  
    function handleData({ sells, buys }) {
      console.dir({
        sells,
        buys,
      });
  
      if (buys.length) setBuys((prev) => [...buys, ...prev]);
      if (sells.length) setSells((prev) => [...sells, ...prev]);
    }

  return (
    <div class="h-100 d-flex align-items-center justify-content-center">
        <div id="sells">
          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Bids</th>
                <th scope="col">Bid Price</th>
                <th scope="col">Sale Price</th>
                <th scope="col">Qty for sale</th>
              </tr>
            </thead>
            <tbody>
                {typeof sells !== 'undefined' && (

                sells.map((row, i) => (
                <tr key={i}>
                  <td className="table-data text-center">&nbsp;</td>
                  <td className="table-data text-center">&nbsp;</td>
                  <td className='table-data text-center'>{row.price}</td>
                  <td className='table-data text-center'>{row.qty}</td>
                </tr>
                                        )
                              )
                                                      )
              }
               {typeof buys !== 'undefined' && (

buys.map((row, i) => (
<tr key={i}>
  <td className='table-data text-center'>{row.qty}</td>
  <td className='table-data text-center'>{row.price}</td>
  <td className="table-data text-center">&nbsp;</td>
  <td className="table-data text-center">&nbsp;</td>
</tr>
                        )
              )
                                      )
}
            </tbody>
          </table>
        </div>
    </div>    
  )
}

export default InstaTable