///Btn is the project convention for tradittional buttons, in order to avoidd confussion with app's buttons
import React, { Component } from "react";

export enum BtnType {

  ICON = "with-icon",
  NOICON = "btn",

}

export interface BtnModel {

    className: string;
    caption: string;
    type: BtnType;
    hasIcon: boolean

}


class Btn extends Component {
  constructor(props) {
    super(props)
    let caption = 'caption'

  }

  render () {
    return (

    );
  }
}



export default function Btn(caption: string, hasIcon: boolean) {


  return (

      <>

        <button className="{hasIcon ? 'btn' : 'btn-with-icon'}">

          {caption}

        </button>

      </>

  );
}
