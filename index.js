var bytes = require('bytes');
var reset = '\033[0m',
    green = '\033[32m',
    blue = '\033[34m',
    purple = '\033[35m',
    red = '\033[31m',
    grey = '\033[90m';

var log = function (prefix, messages) {
    if (typeof messages[0] === 'string') {
        messages[0] = prefix + " " + messages[0];//preserve printf formatting
    } else {
        [].unshift.call(messages, prefix);
    }
    console.log.apply(console, messages);
};

exports = module.exports = function (opts) {
    var options = opts || {withColor: true, logLevel: 0}

    var levels = {
        debug: {prefix: options.withColor ? green + "DEBUG" + reset : "DEBUG", level: 0},
        info: {prefix: options.withColor ? blue + "INFO" + reset : "INFO", level: 1},
        warn: {prefix: options.withColor ? purple + "WARN" + reset : "WARN", level: 2},
        error: {prefix: options.withColor ? red + "ERROR" + reset : "ERROR", level: 3}
    };

    return {
        debug: function (message) {
            if (options.logLevel <= levels.debug.level)
                log(levels.debug.prefix, arguments);
        },
        info: function (message) {
            if (options.logLevel <= levels.info.level)
                log(levels.info.prefix, arguments);
        },
        warn: function (message) {
            if (options.logLevel <= levels.warn.level)

                log(levels.warn.prefix, arguments);
        },
        error: function (message) {
            if (options.logLevel <= levels.error.level)
                log(levels.error.prefix, arguments);
        },
        /**
         *  Custom express logger based upon express.logger('dev')
         */
        express: function (express) {
            //concise output colored by response status for development use
            return express.logger(function (tokens, req, res) {
                var status = res.statusCode
                    , len = parseInt(res.getHeader('Content-Length'), 10)
                    , color = 32;

                if (status >= 500) color = 31
                else if (status >= 400) color = 33
                else if (status >= 300) color = 36;

                len = isNaN(len) ? '' : len = ' - ' + bytes(len);

                if (options.withColor === true) {
                    return levels.debug.prefix
                        + ' ' + grey + req.method
                        + ' ' + req.originalUrl + ' '
                        + '\033[' + color + 'm' + res.statusCode
                        + ' ' + grey + (new Date - req._startTime)
                        + 'ms' + len
                        + reset;
                } else {
                    return levels.debug.prefix
                        + ' ' + req.method
                        + ' ' + req.originalUrl
                        + ' ' + res.statusCode
                        + ' ' + (new Date - req._startTime) + 'ms' + len
                }

            });
        }
    }
};
