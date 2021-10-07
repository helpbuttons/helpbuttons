//create net popup menu
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { catchError } from 'rxjs/operators';
import { useEffect } from 'react';

import Popup from '../../components/popup/Popup';
import NavBottom from '../../components/nav/NavBottom';

import { store } from 'pages/index';
import { alertService } from 'services/Alert';
import { CreateNetwork } from 'pages/NetworkNew/data';
import INetwork from 'services/Networks/network.type';



export default function NetworkNew() {

    const [name, setName] = useState("network example");
    const [url, setUrl] = useState("");
    const [avatar, setAvatar] = useState("");
    const [privacy, setPrivacy] = useState("");
    const [place, setPlace] = useState("");
    const [tags, setTags] = useState([]);
    const [friendNetworks, setFriendNetworks] = useState([]);
    const [description, setDescription] = useState("");
    const [geoPlace, setGeoPlace] = useState('{ "type": "Point", "coordinates": [100.0, 0.0]}');
    const [radius, setRadius] = useState(0);
    const [owner, setOwner] = useState("");

    const router = useRouter();

    // form validation rules
    const networkSchema = Yup.object().shape({

        name: Yup.string(),
        url: Yup.string(),
        avatar: Yup.string(),
        place: Yup.string(),
        description: Yup.string()
            .min(6, 'Description must be at least 6 characters'),
        tags: Yup.string(),
        date: Yup.string(),
        geoPlace: Yup.string(),
        radius: Yup.string(),


    });

    const formOptions = { resolver: yupResolver(networkSchema) };

    const token = window.localStorage.getItem('access_token');

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;


    function onSubmit() {
        //emit is called to trigger the event by the observable
        debugger
        console.log('create net');

        const network: INetwork = {
          
          name: name,
          url: url,
          privacy: privacy,
          avatar: avatar,
          place: place,
          description: description,
          geoPlace: geoPlace,
          tags: tags,
          radius: radius,
          owner: owner,
          friendNetworks: friendNetworks,

        };

        debugger
        store.emit(new CreateNetwork(network, token));

    }


    return (

          <>

              <Popup title="Create Network">

                <form onSubmit={handleSubmit(onSubmit)} className="button-new__container">

                <div className="form__field">
                    <label>Name</label>
                    <input name="name" type="text" {...register('name')} className={`form__input ${errors.name ? '' : ''}`} />
                    <div className="">{errors.name?.message}</div>
                </div>

                <div className="form__field">
                    <label>Avatar</label>
                    <input name="avatar" type="text" {...register('avatar')} className={`form__input ${errors.avatar ? '' : ''}`} />
                    <div className="">{errors.avatar?.message}</div>
                </div>

                <div className="form__field">
                    <label>Url</label>
                    <input name="url" type="text" {...register('url')} className={`form__input ${errors.url ? '' : ''}`} />
                    <div className="">{errors.url?.message}</div>
                </div>

                <div className="form__field">
                    <label>Privacy</label>
                    <input name="privacy" type="text" {...register('privacy')} className={`form__input ${errors.privacy ? '' : ''}`} />
                    <div className="">{errors.privacy?.message}</div>
                </div>

                <div className="form__field">
                    <label>Description</label>
                    <textarea name="description" type="text" {...register('description')} className={`form__input ${errors.description ? '' : ''}`} />
                    <div className="">{errors.description?.message}</div>
                </div>

                <div className="form__field">
                    <label>geoPlace</label>
                    <input name="geoPlace" type="text" {...register('geoPlace')} className={`form__input ${errors.geoPlace ? '' : ''}`} />
                    <div className="">{errors.geoPlace?.message}</div>
                </div>

                <div className="form__field">
                    <label>Radius</label>
                    <input name="radius" type="text" {...register('radius')} className={`form__input ${errors.radius ? '' : ''}`} />
                    <div className="">{errors.radius?.message}</div>
                </div>


                  <div className="popup__options-v">

                    <button type="submit" disabled={formState.isSubmitting}  className="popup__options-btn btn-menu-white">

                      {formState.isSubmitting && <span className=""></span>}
                        Crear

                    </button>

                  </div>

                </form>

              </Popup>

              <NavBottom />

          </>
      );

}
