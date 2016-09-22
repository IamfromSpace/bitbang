parse = require('./ast_parser.js');

var symbols = process.argv[2].split('')
var ast = parse(symbols);
console.log(JSON.stringify(ast, null, 2));

