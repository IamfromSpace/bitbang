function astToJs(ast) {
  a = ast.length ? ast : [ast];
  return a.map(function(e) {
    switch (e.type) {
      case 'SYMBOL':
        switch (e.symbol) {
          case 'BANG':
            return 'd[p]=d[p]^pm;p=pm==1?p+1:p;pm=pm==1?128:pm>>1;';
          case 'LEFT':
            return 'p=pm==128?p-1:p;pm=pm==128?1:pm<<1;';
        }
      case 'LOOP BLOCK':
        return ' while (d[p]&pm) { ' + astToJs(e.contents).join('') + ' } ';
      case 'PROGRAM':
        return 'function program(i,ip,ipm) { d=i||new Uint8Array(30000);p=ip||0;pm=ipm||128;' + astToJs(e.contents).join('') + ' return d; }';
    }
  })
}

module.exports = astToJs
