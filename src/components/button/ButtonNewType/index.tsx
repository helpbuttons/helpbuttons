//This is the first section in the button creation process, but can be displayed or not depending on the selected network settings. It displays the buttons types (default offer an need and exchange) and leads to ButtonNewData after selection
import { useRouter } from 'next/router';


export default function ButtonNewType({ exact, ...props }) {

  function handleChangeEmail(e) {         // separate handler for each field
    let emailValid = e.target.value ? true : false;        // basic email validation
    let submitValid = this.state.textValid && emailvalid   // validate total form
    this.setState({
      email: e.target.value,
      emailValid: emailValid,
      submitDisabled: !submitValid
    });
  }

  return (

    <>

      <div className="popup__section">
        <p className="popup__paragraph">
          Choose your type:
        </p>
        <div name="type" onClick={() => props.setType("offer")} {...props.register('type')} className="btn-with-icon btn-with-icon--hover btn-with-icon--offer">
          <div className="btn-filter__icon green"></div>
          <div className="btn-with-icon__text">
            Offer
          </div>
        </div>

        <div name="type"  onClick={() => props.setType("exchange")} {...props.register('type')} className="btn-with-icon btn-with-icon--hover btn-with-icon--exchange">
          <div className="btn-filter__split-icon">
            <div className="btn-filter__split-icon--half green-l"></div>
            <div className="btn-filter__split-icon--half red-r"></div>
          </div>
          <div className="btn-with-icon__text">
            Exchange
          </div>
        </div>

        <div name="type"  onClick={() => props.setType("need")} {...props.register('type')} className=" btn-with-icon btn-with-icon--hover btn-with-icon--need">
          <div className="btn-filter__icon red"></div>
          <div className="btn-with-icon__text">
            Need
          </div>
        </div>
      </div>

      <div className="invalid-feedback">{props.errors.type?.message}</div>


    </>


  );
}
