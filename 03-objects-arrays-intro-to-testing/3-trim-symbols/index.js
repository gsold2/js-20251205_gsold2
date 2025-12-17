/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
    if (size === undefined) {
        return string;
    }
    if (size === 0) {
        return '';
    }

    let result = '';
    let count = 0;
    let currentChar = '';

    result = string.split('').reduce(
        (accumulator, item) => {
            if (currentChar !== item) {
                count = 1;
                currentChar = item;
                accumulator = accumulator + item;
                return accumulator;
            }

            count++;
            if (count <= size) {
                accumulator = accumulator + item;
            }
            return accumulator;
        },
        "")

    return result;
}
