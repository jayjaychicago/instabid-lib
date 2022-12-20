import {DepthTable} from './DepthTable';
import InstaForm from './InstaForm';

const Instabid = ({exchange, product, user}) => {

    return(<div>
            <DepthTable exchange={exchange} product={product} user={user}></DepthTable>
            <InstaForm exchange={exchange} product={product} user={user}></InstaForm></div>
            );
}
export default Instabid