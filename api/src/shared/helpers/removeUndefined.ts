
export const removeUndefined = (obj: object) =>
Object.entries(obj).reduce((acc: object, curr: any[]) => {
  if (curr[1]) {
    return { ...acc, [curr[0]]: curr[1] };
  }
  return acc;
}, {});