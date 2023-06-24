///dropddown selector component

export default function Dropdown() {

  return (
    <>
      <div className="dropdown-select">
        <select className="dropdown-select__trigger">
          <option value="status" className="dropdown-select__option" disabled>All buttons, messages and updates</option>
        </select>
      </div>
    </>

  );
}
