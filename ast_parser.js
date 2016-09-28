function fullParse(symbols, i, depth, ast) {
  while (i < symbols.length) {
    i++;
    switch(symbols[i]) {
      case "!":
        ast.push({ type: 'SYMBOL', symbol: 'BANG' });
        break;
      case "<":
        ast.push({ type: 'SYMBOL', symbol: 'LEFT' });
        break;
      case "[":
        var d = fullParse(symbols, i, depth + 1, []);
        i = d[0];
        ast.push({ type: 'LOOP BLOCK', contents: d[1] });
        break;
      case "]":
        if (depth === 0) {
          throw Error('Unmatched closing bracket found!  Character position ' + i);
        }
        return [i, ast];
    }
  }
  if (depth != 0) {
    throw Error('Expected a closing bracket!  Character position ' + i);
  }
  return [i, ast];
}

function parse(symbols) {
  return { type: 'PROGRAM', contents: fullParse(symbols, -1, 0, [])[1] };
}

module.exports = parse;
