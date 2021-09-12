//Filters is the component under the search bar sectioon of the home page and other pages. It consist of several items all with button-fillter class, and its parts can be altered by the button templates of the selected network.
//if the filters are too many, it ddisplays a "more filters" option at the end that brings the PopupExtraFilters
function Filters() {
  return (
    <>
      <div>
        <div>
          <div>
            <div>
              <label htmlFor="">
                <div>
                  <div>Qué</div>
                  <input type="" />
                  <span></span>
                </div>
              </label>
              <div></div>
              <span></span>
            </div>
          </div>
          <div>
            <div>
              <label htmlFor="">
                <div>
                  <div>Dónde</div>
                  <input type="" />
                  <span></span>
                </div>
              </label>
              <div></div>
              <span></span>
            </div>
          </div>
          <div>
            <div>
              <label htmlFor="">
                <div>
                  <div>Cuándo</div>
                  <input type="" />
                  <span></span>
                </div>
              </label>
              <div></div>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Filters;
