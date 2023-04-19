import React from "react";
import { DepthTable } from "./DepthTable.jsx";
import { InstaForm } from "./InstaForm.jsx";

export const Instabid = ({ exchange, product, user, devModeApiKey, apiProxy }) => {
  return (
    <div>
      <DepthTable
        exchange={exchange}
        product={product}
        user={user}></DepthTable>
      <InstaForm exchange={exchange} product={product} user={user} devModeApiKey={devModeApiKey} apiProxy={apiProxy}></InstaForm>
    </div>
  );
};
