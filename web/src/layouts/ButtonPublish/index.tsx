//this is the component that shows a resume of the button that is going to be published or edited. It takes all the data from the rest of the ButtonNew steps andd send it to the backend. It leads to Button Share.
import { Component, ChangeEvent } from "react";
import ButtonDataService from "../../services/Buttons";
import ButtonNewDate from '../../components/button/ButtonNewDate';
import ButtonNewLocation from '../../components/button/ButtonNewLocation';

type Props = {};

type State = Button & {
  submitted: boolean
};

export default class AddButton extends Component<Props, State> {
  constructor(props: Props) {

    super(props);

  }


  render() {

    return (
      <>

        <ButtonNewDate setDate={this.props.setDate} date={this.props.date}/>
        <ButtonNewLocation setGeoPlace={this.props.setGeoPlace} geoPlace={this.props.geoPlace}/>

      </>

    );
  }

}
