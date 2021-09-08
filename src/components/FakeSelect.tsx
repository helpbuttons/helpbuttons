import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../store/index';

export default function FakeSelect() {

    const networks = useSelector((state) => state);
    const dispatch = useDispatch();

    const [networksSelect, setNetworkSelect] = useState(networks);

    const { filterNetworks } = bindActionCreators(actionCreators, dispatch);

    return (
        <>
            <label htmlFor="networks">Selecciona una red</label>

            <select name="networks" id="networks" onChange={(e) => filterNetworks(e.target.value)}>
               {networksSelect.map(network => <option key={network.netName} value={network.netName}>{network.netName}</option>)}
                <option value="all" selected>Todas las redes</option>
            </select>
        </>
    );
}
