var bytes = require('bytes');
var reset = '\033[0m';
var green = '\033[32m';
var blue = '\033[34m';
var purple = '\033[35m';
var red = '\033[31m';
var graffiti;

var log = function (prefix, messages) {
    if (typeof messages[0] === 'string') {
        messages[0] = prefix + " " + messages[0];//preserve printf formatting
    } else {
        [].unshift.call(messages, prefix);
    }
    console.log.apply(console, messages);
};

exports = module.exports = function (opts) {
    var options = opts || {withColor: true}

    var levels = {
        debug: options.withColor ? green + "DEBUG" + reset : "DEBUG",
        info: options.withColor ? blue + "INFO" + reset : "INFO",
        warn: options.withColor ? purple + "WARN" + reset : "WARN",
        error: options.withColor ? red + "ERROR" + reset : "ERROR"
    };

    return {
        debug: function (message) {
            log(levels.debug, arguments);
        },
        info: function (message) {
            log(levels.info, arguments);
        },
        warn: function (message) {
            log(levels.warn, arguments);
        },
        error: function (message) {
            log(levels.error, arguments);
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

                return levels.debug + ' \033[90m' + req.method
                    + ' ' + req.originalUrl + ' '
                    + '\033[' + color + 'm' + res.statusCode
                    + ' \033[90m'
                    + (new Date - req._startTime)
                    + 'ms' + len
                    + '\033[0m';
            });
        }
    }
};
