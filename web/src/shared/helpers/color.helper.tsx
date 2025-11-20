export function getReadableTextColor(hexBackgroundColor) {
  if (!hexBackgroundColor || hexBackgroundColor.length < 4) {
    return '#0E0E0E';
  }

  let hex = hexBackgroundColor.substring(1);
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  if (hex.length !== 6) {
    return '#0E0E0E';
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  return brightness > 128 ? '#0E0E0E' : '#f0f0f0';
}