//Form component with the main fields for register in the platform
import CrossIcon from '../../../public/assets/svg/icons/cross1.tsx'
import { UserService } from '../../services/Users';
import { map } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { Component, ChangeEvent } from "react";
import * as React from "react";
import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { useRef } from '../../store/Store';
import { getValueFromInputEvent } from './data';
import { User } from '../../services/Users/user.type';
import NavHeader from '../../components/NavHeader';
import dynamic from 'next/dynamic'


GLOBAL.document = new JSDOM(html).window.document;

function Submit() {

  store.emit(new User());

}

let userModel: User = {};

let buttonElement: HTMLButtonElement;
let emailInput: HTMLInputElement;
let passwordInput: HTMLInputElement;

let emailChange$: Observable<InputEvent>;
let passwordChange$: Observable<InputEvent>;
let submit$: Observable<MouseEvent>;

export default class PopupRegister extends React.Component {


  constructor(props) {

    super(props);
    this.state = {value: '', user: userModel};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    buttonElement = document.getElementById("submit") as HTMLButtonElement;
    emailInput = document.getElementById("email") as HTMLInputElement;
    passwordInput = document.getElementById("password") as HTMLInputElement;

    emailChange$ = fromEvent<InputEvent>(emailInput, "input");
    passwordChange$ = fromEvent<InputEvent>(passwordInput, "input");
    submit$ = fromEvent<MouseEvent>(buttonElement, "click");


  }


  handleChange(event) {

    this.setState({value: event.target.value});

    emailChange$
      .pipe(map((event: InputEvent) => (event.target as HTMLInputElement).value))
      .subscribe(email => {
        console.log("email Value: ", email);
        userModel.email = email;
      })
      .unsuscribe();

    passwordChange$
      .pipe(map((event: InputEvent) => (event.target as HTMLInputElement).value))
      .subscribe(password => {
        console.log("password Value:", password);
        userModel.password = password;
      })
      .unsuscribe();


    submit$
    .pipe(tap((event: MouseEvent) => console.log(event)))
    .subscribe(() => console.log("Sending User", { userModel }))
    .unsuscribe();

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
        <>

        <div className="popup">
          <div className="popup__header">
            <header className="popup__header-content">
              <div className="popup__header-left">
                <button className="popup__header-button">
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </button>
              </div>
              <div className="popup__header-center">
                <h1 className="popup__header-title">
                  Register
                </h1>
              </div>
              <div className="popup__header-right">
                <button className="popup__header-button">
                  <div className="btn-circle__icon">
                    <CrossIcon />
                  </div>
                </button>
              </div>
            </header>
          </div>

          <div className="popup__content">

            <div className="popup__img">
              <img src="https://dummyimage.com/550x200/#ccc/fff" alt="Register_img" className=""></img>
            </div>

            <form className="popup__section" onSubmit={this.handleSubmit}>

              <div className="form-field">
                <input type="text" id="email" className="form__input" value={this.state.value} onChange={this.handleChange} placeholder="Escribe tu mail para participar"></input>
              </div>

              <div className="form-field">
                <input type="text"  id="password" className="form__input" value={this.state.value} onChange={this.handleChange} placeholder="Escribe una contraseña"></input>
              </div>

              <button className="btn-with-icon button-with-icon--offer" id="submit" type="submit" value="Submit" onSubmit={this.handleChange}>
                <div className="btn-filter__icon">
                  <CrossIcon />
                </div>
                <div className="btn-with-icon__text">
                  ENTRAR
                </div>
              </button>

            </form>

            <div className="popup__options-v">

              <button className="popup__options-btn">Tengo cuenta</button>

            </div>

          </div>

        </div>
    </>
    );
  }
}
