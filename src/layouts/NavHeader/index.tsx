///this is the mobile header - it has the search input in the middle and to icons on the sides. Left one ddisplays HeaderInfoOverlay with the netpicker and descripttion (in case it's in a net the trigger is the net's logo), right nav btn diisplays the filters
import HeaderInfoOverlay from "../HeaderInfoOverlay";

function NavHeader(){
  return(

    <nav >
      <HeaderInfoOverlay/>
      </nav>
  )
}

export default NavHeader
