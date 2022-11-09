import { nestedFlattenObjectFieldValue } from './flatten-object.helper';

export function fieldSorter(fields: string[]) {
    return function (a: any, b: any) {
        return fields
            .map(function (fieldKey) {
                // README: Sort Ascending
                let dir = 1;

                if (fieldKey[0] === '-') {
                    // README: Sort descending
                    dir = -1;
                    fieldKey = fieldKey.substring(1);
                }

                const aValue = nestedFlattenObjectFieldValue(
                    fieldKey,
                    a,
                );
                const bValue = nestedFlattenObjectFieldValue(
                    fieldKey,
                    b,
                );

                if (
                    typeof aValue === 'number' ||
                    typeof bValue === 'number'
                ) {
                    if (aValue ?? 0 > bValue ?? 0) {
                        return dir;
                    }
                    if (aValue ?? 0 < bValue ?? 0) {
                        return -dir;
                    }
                } else {
                    if (aValue ?? 0 > bValue ?? 0) {
                        return dir;
                    }
                    if (aValue ?? 0 < bValue ?? 0) {
                        return -dir;
                    }
                }
                return 0;
            })
            .reduce(function firstNonZeroValue(p, n) {
                return p ? p : n;
            }, 0);
    };
}
