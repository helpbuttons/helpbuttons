//List of elements component that can be used in home, profile and other pages/layouts where we need to ddisplay buttons/networks/other elements
//a foreach => buttons
import CardButtonList from "../../../components/list/CardButtonList";
import Link from 'next/link'


function List({ buttons }) {
  return (
      <>

        <div className="list__container">

              <div className="drag-tab"><span className="drag-tab__line"></span></div>

              <div className="list__content">

                    <ul>
                      {buttons.map((button) => (
                        <li key={button.id}>
                          <Link
                            href={{
                              pathname: '/button/[slug]',
                              query: { slug: button.slug },
                            }}
                          >
                            <a>{button.name}</a>
                          </Link>
                        </li>
                      ))}
                    </ul>

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
