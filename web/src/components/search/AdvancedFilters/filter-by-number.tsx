
import Slider from 'rc-slider';

export function FilterByNumber({
  number,
  setNumber,
  max = 100,
  label
}) {

  return (
    <>
        <div className="form__field">

          <div >
            <Slider
              min={1}
              max={max}
              onChange={(value) => {
                setNumber(value)
              }}
              defaultValue={number}
            />
          </div>
          <div className="form__input form__fake-input">
            {label}
          </div>
        </div>

    </>
  );
}
