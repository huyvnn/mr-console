const format = (...fullArgs) => {
  const re = /(%?)(%([jds]))/g;
  let fmt = fullArgs[0];
  const args = Array.prototype.slice.call(fullArgs, 1);

  if (args.length) {
    fmt = fmt.replace(re, (match, escaped, ptn, flag) => {
      let arg = args.shift();
      switch (flag) {
        case 's':
          arg = `${arg}`;
          break;
        case 'd':
          arg = Number(arg);
          break;
        case 'j':
          arg = JSON.stringify(arg);
          break;
        default:
          break;
      }
      if (!escaped) {
        return arg;
      }

      return match;
    });
  }

  // arguments remain after formatting
  if (args.length) {
    const consistObject = args.filter((arg) => {
      const type = Object.prototype.toString.call(arg).slice(8, -1);
      return type === 'Object' || type === 'Array';
    }).length > 0;

    if (!consistObject) {
      fmt += ` ${args.join(' ')}`;
      
      // update escaped %% values
      fmt = fmt.replace(/%{2,2}/g, '%');
    } else {
      return [fmt, ...args];
    }
  }

  return `${fmt}`;
};

export default format;
