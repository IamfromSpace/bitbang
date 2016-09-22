function fullParse(symbols, i, ast) {
  while (i < symbols.length) {
    i++;
    switch(symbols[i]) {
      case "!":
        ast.push({ type: 'SYMBOL', symbol: 'BANG' });
        break;
      case "<":
        ast.push({ type: 'SYMBOL', symbol: 'LEFT' });
        break;
      case ".":
        ast.push({ type: 'SYMBOL', symbol: 'IN' });
        break;
      case ",":
        ast.push({ type: 'SYMBOL', symbol: 'OUT' });
        break;
      case "[":
        var d = fullParse(symbols, i, []);
        i = d[0];
        ast.push({ type: 'LOOP BLOCK', contents: d[1] });
        break;
      case "]":
        return [i, ast];
    }
  }
  return [i, ast];
}

function parse(symbols) {
  return { type: 'PROGRAM', contents: fullParse(symbols, -1, [])[1] };
}

module.exports = parse;
