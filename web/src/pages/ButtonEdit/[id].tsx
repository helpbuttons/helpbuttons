import ButtonForm from "components/button/ButtonForm";
import { GlobalState, store } from 'pages';
import { CreateButton, SaveButtonDraft } from 'state/Explore';
import { NavigateTo } from 'state/Routes';
import { useRef } from 'store/Store';
import Router from 'next/router';
import { alertService } from 'services/Alert';

export default function ButtonEdit() {
  const selectedNetwork = useRef(
    store,
    (state: GlobalState) => state.networks.selectedNetwork,
  );
  
  const onSubmit = (data) => {
    console.log('not implemented yet..')
    // store.emit(
      // new UpdateButton(data, selectedNetwork.id, onSuccess, onError),
    // );
  };

  const onSuccess = () => {
    store.emit(new NavigateTo('/Explore'));
  };

  const onError = (err, data) => {
    if (err == 'unauthorized') {
      Router.push({
        pathname: '/Login',
        query: { returnUrl: 'ButtonNew' },
      });
    } else {
      alertService.error('Error on creating button ' + err, {});
    }
  };
  return (
    <>
    TO IMPLEMENT
      {/* <ButtonForm onSubmit={onSubmit}></ButtonForm> */}
    </>
  );
}
