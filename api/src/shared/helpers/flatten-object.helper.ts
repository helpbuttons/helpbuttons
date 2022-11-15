export function nestedFlattenObjectFieldValue(
    nestedJoinedFieldByDot: string,
    obj: any,
): any {
    return flattenObject(obj)[nestedJoinedFieldByDot];
}

export function flattenObject(value: any): any {
    let toReturn: any = {};

    for (const i in value) {
        if (!value.hasOwnProperty(i)) {
            continue;
        }

        if (typeof value[i] == 'object') {
            const flatObject = flattenObject(value[i]);
            for (const x in flatObject) {
                if (!flatObject.hasOwnProperty(x)) {
                    continue;
                }

                toReturn[i + '.' + x] = flatObject[x];
            }
        } else {
            toReturn[i] = value[i];
        }
    }
    return toReturn;
}
