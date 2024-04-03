import Feed from "layouts/Feed";
import CardButton from "../CardButton";

export function ButtonShow({ currentButton, buttonTypes }) {
    return (
      <>
        <CardButton button={currentButton} buttonTypes={buttonTypes} />
        <Feed button={currentButton} />
      </>
    );
  }