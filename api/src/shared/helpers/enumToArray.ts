export function enumToArray<V>(myEnum: any): V[] {
    return Object.keys(myEnum).map((key) => myEnum[key] as V);
}
