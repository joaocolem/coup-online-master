function normalizeValue(value) {
    return value.reduce((acc, v, index) => index !== (value.length - 1) ? acc += `'${v}',` : acc += `'${v}'`, ``);
}

module.exports = {
    normalizeValue
}