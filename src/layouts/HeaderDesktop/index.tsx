//Header component for desktop , with DropdownNet on the right, button creation and user access. logo/network logo on the right, search bar and filters underneath
import NavHeader from "../../layouts/NavHeader";
import HeaderInfoOverlay from "../HeaderInfoOverlay";

export default function HeaderDesktop() {
  return (
    <header >
        <ul>
          <li>
            <a href="">Añadir Boton</a>
          </li>
          <li>
            <a href="">Perfil</a>
          </li>
          <li>
            <select>
              <option value="">1</option>
              <option value="">2</option>
              <option value="">3</option>
            </select>
          </li>
        </ul>
      </header>
  );
}
