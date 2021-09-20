//Header component for desktop , with DropdownNet on the right, button creation and user access. logo/network logo on the right, search bar and filters underneath
import NavHeader from "../../layouts/NavHeader";
import HeaderSearch from "../../components/HeaderSearch";
import DropdownNets from "../../components/DropdownNets";
import Filters from "../../components/Filters";


export default function HeaderDesktop() {
  return (
    <header>
      <HeaderSearch />
      <DropdownNets />
      <Filters />
    </header>
  );
}
