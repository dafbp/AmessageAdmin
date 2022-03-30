const fabric = require('@umijs/fabric')

module.exports = {
    ...fabric.prettier,
    printWidth: 160,
    tabWidth: 4,
    jsxBracketSameLine: true,
    jsxSingleQuote: true,
    singleQuote: true,
    semi: false,
}
