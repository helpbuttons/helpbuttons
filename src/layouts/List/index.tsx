//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import CardButtonList from "../../components/CardButtonList";

function List() {
  return (
      <>

        <div className="list__container">

              <div className="drag-tab"><span className="drag-tab__line"></span></div>

              <div className="list__content">

                  <div className="list__element">
                    <CardButtonList />
                  </div>
                  <div className="list__element">
                    <CardButtonList />
                  </div>

              </div>

        </div>

      </>
  );

}

export default List;
