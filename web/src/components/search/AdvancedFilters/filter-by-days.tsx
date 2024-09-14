import t from 'i18n';
import Slider from 'rc-slider';

export function FilterByDays({
  days,
  setDays,
}) {

  const marks = [10, 30, 100, 365];
  const calcValueFromSlider = (value) => {
    const mark = Math.ceil(value / 100)
    const min = marks[mark-1]
    const max = marks[mark]
    return Math.floor(min + ((max-min) / 100)* (value - (mark - 1) * 100));
  }

  const calcSliderFromValue = (value) => {
    let markIndex = 0;
  
    for (let i = 0; i < marks.length - 1; i++) {
      if (value >= marks[i] && value <= marks[i + 1]) {
        markIndex = i;
        break;
      }
    }
  
    const min = marks[markIndex];
    const max = marks[markIndex + 1];

    const sliderValue = (markIndex * 100) + ((value - min) / (max - min)) * 100;
    return sliderValue;
  };
  return (
    <>
        <div className="form__field">
          <label className="form__label">
            {t('buttonFilters.days')} -&nbsp;
            {days}
          </label>
          <div style={{ padding: '1rem' }}>
            <Slider
              min={1}
              max={(marks.length - 1)*100}
              onChange={(value) => {
                setDays(calcValueFromSlider(value));
              }}
              defaultValue={calcSliderFromValue(days)}
            />
          </div>
        </div>
    </>
  );
}
