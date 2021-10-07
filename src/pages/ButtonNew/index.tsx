//Create new button and edit button URL, with three steps with different layouts in the following order: NewType --> NewData --> NewPublish --> Share
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { catchError } from 'rxjs/operators';
import { useEffect } from 'react';

import Popup from 'components/popup/Popup'
import NavBottom from 'components/nav/NavBottom'
import ButtonNewType from "components/button/ButtonNewType";
import ButtonNewData from "components/button/ButtonNewData";
import ButtonPublish from "layouts/ButtonPublish";
import ButtonShare from "components/button/ButtonShare";

import { store } from 'pages/index';
import { useRef } from 'store/Store';
import { alertService } from 'services/Alert';
import { CreateEvent } from 'pages/ButtonNew/data';
import IButton from 'services/Buttons/button.type';


export default function ButtonNew() {

    const [name, setName] = useState("");
    const [owner, setOwner] = useState(0);
    const [templateButtonId, setTemplateButtonId] = useState(0);
    const [type, setType] = useState("offer");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState([]);
    const [date, setDate] = useState("");
    const [location, setLoc] = useState('{ "type": "Point", "coordinates": [100.0, 0.0]}');
    const [networks, setNetworks] = useState([]);
    const [feedType, setFeedType] = useState("");
    const [templateExtraData, setTemplateExtraData] = useState("");

    const networkId = useRef(store, (state) => state.network.id.toString());

    const router = useRouter();

    // form validation rules
    const buttonSchema = Yup.object().shape({

        type: Yup.mixed(),
        description: Yup.string()
            .min(6, 'Description must be at least 6 characters'),
        tags: Yup.string(),
        date: Yup.string(),
        location: Yup.string(),

    });

    const formOptions = { resolver: yupResolver(buttonSchema) };

    const token = window.localStorage.getItem('access_token');

    // get functions to build form with useForm() hook
    const { register, handleSubmit, formState } = useForm(formOptions);
    const { errors } = formState;


    function onSubmit() {
        //emit is called to trigger the event by the observable
        debugger
        console.log('login');

        const button: IButton = {

          name: name,
          templateButtonId: templateButtonId,
          type: type,
          tags: tags,
          description: description,
          //required data
          // date: date,
          //GIS DATA
          geoPlace: location,
          // optional values
          networks: networks,
          // feedType: feedType, //enum {single,group} feed structure
          // templateExtraData: JSON.stringify(templateExtraData),

        };

        debugger
        store.emit(new CreateEvent(button, token, networkId));

    }


    return (

          <>

              <Popup title="Crear Botón">

                <form onSubmit={handleSubmit(onSubmit)} className="button-new__container">

                  <ButtonNewType setType={setType} type={type} register={register} errors={errors}/>
                  {type}

                  <ButtonNewData  setDescription={setDescription} setTags={setTags} description={description} tags={tags} register={register} errors={errors}/>
                  {tags}
                  {description}

                  <ButtonPublish setDate={setDate} setLoc={setLoc} setFeedType={setFeedType} date={date} location={location} feedType={feedType} register={register} errors={errors}/>
                  {date}
                  {location}
                  {feedType}

                  <ButtonShare />

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
