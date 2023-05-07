import React from "react";
import { DepthTable } from "./DepthTable.jsx";
import { InstaForm } from "./InstaForm.jsx";

export const Instabid = ({ exchange, product, user, devModeApiKey, apiProxy, authUrl }) => {
  return (
    <div>
      <DepthTable
        exchange={exchange}
        product={product}
        user={user}></DepthTable>
      <InstaForm exchange={exchange} product={product} user={user} devModeApiKey={devModeApiKey} apiProxy={apiProxy} authUrl={authUrl}></InstaForm>
      <OrderTable
        exchange={exchange}
        product={product}
        user={user}></OrderTable>
    </div>
  );
};
