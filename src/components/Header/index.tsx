import SelectNetwork from "../SelectNetwork";
import styles from './header.module.scss'

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.header__logoContainer}>
        <a className={styles.header__logo} href="#!">Logo</a>
        <span>Nombre de Red</span>
        <span>Descripción de Red</span>
      </div>
      <nav className={styles.header__nav}>
        <ul>
          <li>
            <a href="">Añadir Boton</a>
          </li>
          <li>
            <a href="">Perfil</a>
          </li>
          <li>
            <SelectNetwork />
          </li>
        </ul>
      </nav>
    </header>
  );
}
