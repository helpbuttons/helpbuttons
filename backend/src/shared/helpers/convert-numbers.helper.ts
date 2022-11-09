const arabicNumbers = [
    '١',
    '٢',
    '٣',
    '٤',
    '٥',
    '٦',
    '٧',
    '٨',
    '٩',
    '٠',
];
const persianNumbers = [
    '۱',
    '۲',
    '۳',
    '۴',
    '۵',
    '۶',
    '۷',
    '۸',
    '۹',
    '۰',
];
const englishNumbers = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '0',
];

export function toEnglishNumber(value: string): string {
    if (!value) {
        return;
    }
    let result: string = value;

    for (
        let index = 0, numbersLen = englishNumbers.length;
        index < numbersLen;
        index++
    ) {
        result = result
            .replace(
                new RegExp(persianNumbers[index], 'g'),
                englishNumbers[index],
            )
            .replace(
                new RegExp(arabicNumbers[index], 'g'),
                englishNumbers[index],
            );
    }

    return result;
}
