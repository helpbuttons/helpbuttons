///dropddown selector component

export default function Dropdown() {

  return (
    <>
      <div className="dropdown-select">
        <select className="dropdown-select__trigger">
          <option value="status" className="dropdown-select__option">Status changes</option>
          <option value="status" className="dropdown-select__option">All comments</option>
          <option value="status" className="dropdown-select__option">Other users comments</option>
          <option value="status" className="dropdown-select__option">Telegram messages</option>
          <option value="status" className="dropdown-select__option">All interactions</option>
          <option value="status" className="dropdown-select__option">Other buttons interactions</option>
          <option value="status" className="dropdown-select__option">My buttons interactions</option>
        </select>
      </div>
    </>

  );
}
