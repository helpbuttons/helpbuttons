//Header component for desktop , with DropdownNet on the right, button creation and user access. logo/network logo on the right, search bar and filters underneath
import NavHeader from "../../layouts/NavHeader";
import HeaderSearch from "../../components/search/HeaderSearch";
import DropdownNets from "../../components/network/DropdownNets";
import Filters from "../../components/search/Filters";


export default function HeaderDesktop() {
  return (
    <header>
      <HeaderSearch />
      <DropdownNets />
      <Filters />
    </header>
  );
}
