parse = require('./ast_parser.js');
toJs = require('./to_js.js');

function Uint8ArrayToStr(arr) {
  return Array.prototype.slice
    .call(arr)
    .map(m => ('00000000' + (m >>> 0).toString(2)).slice(-8))
    .join('')
  ;
}

var symbols = process.argv[2].split('')
var ast = parse(symbols);
var js = toJs(ast)[0];
eval(js);
console.log(Uint8ArrayToStr(program()).substring(0,240));
