import React, { useState } from "react";
import { DepthTable } from "./DepthTable.jsx";
import { InstaForm } from "./InstaForm.jsx";
import { OrderTable } from "./OrderTable.jsx";
import { FillTable } from "./FillTable.jsx";
import {Tabs, Tab} from 'react-bootstrap';

export const Instabid = ({ exchange, product, user, devModeApiKey, apiProxy, authUrl, mode, adminUser }) => {

  const [selectedOrder, setSelectedOrder] = useState(null);

  console.log("LIB Instabid has apiProxy= ", apiProxy)

  const onSelect = (order) => {
    setSelectedOrder(order);
  }

  if (mode == "withOrders") {
    return (
      <div className="d-flex flex-column w-100 align-items-center">
                  <Tabs defaultActiveKey="makeBid"
                    id="uncontrolled-tab"
                    className="justify-content-center">
                    <Tab eventKey="makeBid" title="Make a Bid">
                    <DepthTable
              exchange={exchange}
              product={product}
              onSelect={onSelect}
              user={user}
              devModeApiKey={devModeApiKey} apiProxy={apiProxy}></DepthTable>
            <InstaForm exchange={exchange} product={product} selectedOrder={selectedOrder} user={user} devModeApiKey={devModeApiKey} apiProxy={apiProxy} authUrl={authUrl}></InstaForm>
                  </Tab>
                  <Tab eventKey="orders" title="Orders">
                  <OrderTable
              exchange={exchange}
              product={product}
              user={user}
              devModeApiKey={devModeApiKey} apiProxy={apiProxy}></OrderTable>
                  </Tab>
                  <Tab eventKey="fills" title="Fills">
                  <FillTable
              exchange={exchange}
              product={product}
              user={user}
              devModeApiKey={devModeApiKey} apiProxy={apiProxy}></FillTable>
                  </Tab>
                  </Tabs>
      </div>
        );
  } else {
  return (  <div>
    <DepthTable
              exchange={exchange}
              product={product}
              onSelect={onSelect}
              user={user}
              devModeApiKey={devModeApiKey} apiProxy={apiProxy}></DepthTable>
    <InstaForm exchange={exchange} product={product} selectedOrder={selectedOrder} user={user} devModeApiKey={devModeApiKey} apiProxy={apiProxy} authUrl={authUrl}></InstaForm>
  </div>
  );
  }
};
