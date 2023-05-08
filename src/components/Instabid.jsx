import React from "react";
import { DepthTable } from "./DepthTable.jsx";
import { InstaForm } from "./InstaForm.jsx";
import { OrderTable } from "./OrderTable.jsx";

export const Instabid = ({ exchange, product, user, devModeApiKey, apiProxy, authUrl }) => {
  return (
<div className="d-flex flex-column w-100 align-items-center">
            <Tabs defaultActiveKey="makeBid"
              id="uncontrolled-tab"
              className="justify-content-center">
              <Tab eventKey="makeBid" title="Make a Bid">
              <DepthTable
        exchange={exchange}
        product={product}
        user={user}></DepthTable>
      <InstaForm exchange={exchange} product={product} user={user} devModeApiKey={devModeApiKey} apiProxy={apiProxy} authUrl={authUrl}></InstaForm>
            </Tab>
            <Tab eventKey="orders" title="Orders">
            <OrderTable
        exchange={exchange}
        product={product}
        user={user}></OrderTable>
            </Tab>
            </Tabs>
</div>


  );
};
