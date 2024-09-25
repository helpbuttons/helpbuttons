
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
          <label className="form__label">
            {label}
          </label>
          <div style={{ padding: '1rem' }}>
            <Slider
              min={1}
              max={max}
              onChange={(value) => {
                setNumber(value)
              }}
              defaultValue={number}
            />
          </div>
        </div>

    </>
  );
}
