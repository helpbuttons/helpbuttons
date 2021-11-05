//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import Popup from 'components/popup/Popup'
import ButtonNewType from "components/button/ButtonNewType";
import ButtonNewData from "components/button/ButtonNewData";
import ButtonPublish from "layouts/ButtonPublish";
import ButtonShare from "components/button/ButtonShare";

import { store } from 'pages/index';
import { useRef } from 'store/Store';
import { CreateButtonEvent } from 'pages/ButtonNew/data';
import IButton from 'services/Buttons/button.type';


export default function ButtonNew() {

    const router = useRouter();

  // form variables
    const [name, setName] = useState("");
    const [owner, setOwner] = useState(0);
    const [templateButtonId, setTemplateButtonId] = useState(0);
    const [type, setType] = useState("offer");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [date, setDate] = useState("");
    const [geoPlace, setGeoPlace] = useState('{ "type": "Point", "coordinates": [100.0, 0.0]}');
    const [networks, setNetworks] = useState([]);
    const [feedType, setFeedType] = useState("");
    const [templateExtraData, setTemplateExtraData] = useState("");

    // get selected network from store and/or localStorage
    // const networkId = useRef(store, (state) => state.network.id.toString());
    const networkId = window.localStorage.getItem('network_id');
    // get validation token from localStorage
    const token = window.localStorage.getItem('access_token');


    // form validation rules
    const buttonSchema = Yup.object().shape({

        type: Yup.mixed(),
        description: Yup.string()
            .min(6, 'Description must be at least 6 characters'),
        tags: Yup.string(),
        date: Yup.string(),
        location: Yup.string(),

    });
    
    // form validation YUP functions
    const formOptions = { resolver: yupResolver(buttonSchema) };
    // get functions to build form with useForm() hook. Not used to store or send the data
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;


    function onSubmit() {
        console.log('create button');

        //button data interface to be stored and sent
        const button: IButton = {

          name: name,
          templateButtonId: templateButtonId,
          type: type,
          tags: tags,
          description: description,
          //required data
          // date: date,
          //GIS DATA
          geoPlace: geoPlace,
          // optional values
          networks: networks,
          // feedType: feedType, //enum {single,group} feed structure
          // templateExtraData: JSON.stringify(templateExtraData),

        };

        //emit is called to trigger the event by the observable
        store.emit(new CreateButtonEvent(button, token, networkId));

    }


    return (

          <>

              <Popup title="Create Button">

                <form onSubmit={handleSubmit(onSubmit)} className="popup__section">

                  <ButtonNewType setType={setType} type={type} register={register} errors={errors}/>

                  <ButtonNewData  setDescription={setDescription} setTags={setTags} description={description} tags={tags} register={register} errors={errors}/>
                  {tags}
                  {description}

                  <ButtonPublish setDate={setDate} setGeoPlace={setGeoPlace} setFeedType={setFeedType} date={date} geoPlace={geoPlace} feedType={feedType} register={register} errors={errors}/>


                  <ButtonShare />

                  <div className="popup__options-v">

                    <button type="submit" disabled={formState.isSubmitting}  className="popup__options-btn btn-menu-white">

                      {formState.isSubmitting && <span className=""></span>}
                        Create Button

                    </button>

                  </div>

                </form>

              </Popup>



          </>
      );

}
