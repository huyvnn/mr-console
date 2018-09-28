import format from './format-util';

const levels = ['trace', 'debug', 'log', 'info', 'warn', 'error', 'fatal'];
const noop = () => { };

class MrConsole {
  static $instance;

  constructor(options) {
    // options = { prefix, level, background, color };
    this.opts = options || {};
    this.opts.level = this.opts.level || 'debug';
    this.opts.background = this.opts.background || '#0000ff';
    this.opts.color = this.opts.color || '#ffffff';

    // TODO: Build logger
    this.buildLogger.bind(this)();
  }

  static setup(options) {
    if (!MrConsole.$instance) {
      const opts = { 
        ...options,
        prefix: (level) => {
          return `[${MrConsole.timeString()}]`;
        } 
      };
      MrConsole.$instance = new MrConsole(opts);
      window.log = MrConsole.instance;
    }

    return MrConsole.$instance;
  }

  static get instance() {
    return MrConsole.setup();
  }

  static timeString = () => {
    const today = new Date().toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: 'numeric', // 2-digit / short
      second: 'numeric',
    }).split(' ').join('-');

    return today;
  }

  buildLogger() {
    const that = this;
    levels.forEach((level) => {
      const log = (...args) => {
        const { opts } = this;
        let { prefix } = opts;
        let normalizedLevel;
        let arg0 = args[0];

        // if (!arg0) return;
        if (arg0 == null) arg0 = 'null';
        if (arg0 === undefined) arg0 = 'undefined';

        if (opts.stderr) {
          normalizedLevel = 'error';
        } else {
          switch (level) {
            case 'trace': normalizedLevel = 'info'; break;
            case 'debug': normalizedLevel = 'log'; break;
            case 'fatal': normalizedLevel = 'error'; break;
            default: normalizedLevel = level;
          }
        }

        if (prefix) {
          if (typeof prefix === 'function') prefix = prefix(level);
          arg0 = format(prefix, arg0);
        }

        const restArgs = args.slice(1);
        const isDebug = level === 'debug';
        let style = '';

        if (isDebug) {
          arg0 = `%c${arg0}`;
          style = `background: ${opts.background}; color: ${opts.color}`;
        }

        let formattedArgs = (restArgs.length > 0) ? format(arg0, ...restArgs) : arg0;
        !Array.isArray(formattedArgs) && (formattedArgs = [formattedArgs]);
        isDebug && formattedArgs.splice(1, 0, style);

        return that.$log(normalizedLevel, formattedArgs);
      };

      that[level] = that.$shouldLog(level) ? log(level) : noop;
    });
  }

  $shouldLog = (level) => {
    return levels.indexOf(level) >= levels.indexOf(this.opts.level);
  }

  $log(level, args) {
    const out = console;
    const fn = out[level];
    return Function.prototype.bind.call(fn, console, ...args);
  }

  static getCaller = () => {
    let callerName;
    try {
      throw new Error();
    } catch (e) {
      const re = /(\w+)@|at (\w+) \(/g;
      const st = e.stack;
      const m = re.exec(st);
      re.exec(st);
      callerName = m[1] || m[2];
    }

    return callerName;
  }
}

export default MrConsole;
