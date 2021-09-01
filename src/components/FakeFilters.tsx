import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';


export default function FakeFilters() {

    const networks = useSelector((state) => state);
    const dispatch = useDispatch();

    return (
        <>
            <h1>Fakes filters: </h1>
            <span>Que: </span>
            <span>Donde: { networks.length === 1 ? networks[0].netLocation : "" }</span>
            <span>Cuando: { networks.length === 1 ? networks[0].netButtons[0].date : "" }</span>
        </>
    );
}

