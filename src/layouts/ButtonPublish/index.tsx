//this is the component that shows a resume of the button that is going to be published or edited. It takes all the data from the rest of the ButtonNew steps andd send it to the backend. It leads to Button Share.
import { Component, ChangeEvent } from "react";
import ButtonDataService from "../../services/Buttons";
import IButton from '../../services/Buttons/button.type.tsx';
import ButtonNewDate from '../../layouts/ButtonNewDate';
import ButtonNewLocation from '../../layouts/ButtonNewLocation';

type Props = {};

type State = IButton & {
  submitted: boolean
};

export default class AddButton extends Component<Props, State> {
  constructor(props: Props) {

    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveButton = this.saveButton.bind(this);
    this.newButton = this.newButton.bind(this);

    this.state = {

      id: null,
      templateId: null,
      tags: [],
      active: true,
      //required data
      date: [],
      //GIS DATA
      location: [],
      longitude: [],
      latitude: [],
      // optional values
      networks: [],
      feedType: "single", //enum {single,group} feed structure
      templateExtraData: {}, //JSON

    };
  }

  onChangeTitle(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e: ChangeEvent<HTMLInputElement>) {
    this.setState({
      description: e.target.value
    });
  }

  saveButton() {
    const data: IButtonData = {
      title: this.state.title,
      description: this.state.description
    };

    ButtonDataService.create(data)
      .then(response => {
        this.setState({
          id: null,
          templateId: null,
          tags: [],
          active: true,
          //required data
          date: [],
          //GIS DATA
          location: [],
          longitude: [],
          latitude: [],
          // optional values
          networks: [],
          feedType: "single", //enum {single,group} feed structure
          templateExtraData: {}, //JSON
        });
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  }

  newButton() {
    this.setState({
      id: null,
      templateId: null,
      active: true,
      tags: [],
      //required data
      date: [],
      //GIS DATA
      location: [],
      longitude: [],
      latitude: [],
      // optional values
      networks: [],
      feedType: "single", //enum {single,group} feed structure
      templateExtraData: {}, //JSON
    });
  }

  render() {
    const { submitted, title, description } = this.state;

    return (
      <>

        <ButtonNewDate />
        <ButtonNewLocation />

        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button className="btn btn-success" onClick={this.newButton}>
                Add
              </button>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  required
                  value={title}
                  onChange={this.onChangeTitle}
                  name="title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  type="text"
                  className="form-control"
                  id="description"
                  required
                  value={description}
                  onChange={this.onChangeDescription}
                  name="description"
                />
              </div>

              <button onClick={this.saveButton} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>

      </>

    );
  }

}

export function ButtonPublish() {

  return (

    <>
      <ButtonNewDate />
      <ButtonNewLocation />
    </>

  );
}
