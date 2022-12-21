import { DepthTable } from "./depth-table";
import { InstaForm } from "./insta-form";

export const InstaBid = ({ exchange, product, user }) => {
  return (
    <div>
      <DepthTable
        exchange={exchange}
        product={product}
        user={user}></DepthTable>
      <InstaForm exchange={exchange} product={product} user={user}></InstaForm>
    </div>
  );
};
