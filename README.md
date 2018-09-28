# console-log

> A powerful console logger javascript library

## Example usage

Configure the console logger by passing an object ``options`` with the method ``setup()``

```js
import MrConsole from 'mr-console';

process.env.NODE_ENV = 'production';

// trigger window.log with the method setup()
MrConsole.setup({
  level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info'
});

log.trace('a') // will not do anything
log.debug('b') // will not do anything
log.info('c')  // will output 'c\n' on STDOUT
log.warn('d')  // will output 'd\n' on STDERR
log.error('e') // will output 'e\n' on STDERR
log.fatal('f') // will output 'f\n' on STDERR
```

## Options

### level

A `string` to specify the log level. Defaults to `debug`.

### prefix

Specify this option if you want to set a prefix for all log messages.
This must be a `string` or a `function` that returns a string.

Will get the level of the currently logged message as the first
argument.

### stderr

A `boolean` to log everything to stderr. Defauls to `false`.

### background

A `string` to define background color code to log.debug. Defauls to `#0000ff`.

### color

A `string` to define forecolor code to log.debug. Defauls to `#ffffff`.

## License

MIT