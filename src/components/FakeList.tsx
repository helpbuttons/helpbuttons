import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';

export default function FakeList() {

    const networks = useSelector((state) => state);
    const dispatch = useDispatch();
    
    return (
        <div>
            {
                networks.map(network => {
                    return (
                        <div key={network.netName}>
                            <p>Nombre de red: {network.netName}</p>
                            <p>botones: {network.netButtons.length}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}
