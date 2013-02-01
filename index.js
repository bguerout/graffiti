var graffiti = exports,
    bytes = require('bytes');

var levels = {
    debug: '\033[32m' + "DEBUG" + '\033[0m',
    info: '\033[34m' + "INFO" + '\033[0m',
    warn: '\033[35m' + "WARN" + '\033[0m',
    error: '\033[31m' + "ERROR" + '\033[0m'
};

var log = function (prefix, messages) {
    if (typeof messages[0] === 'string') {
        messages[0] = prefix + " " + messages[0];//preserve printf formatting
    } else {
        [].unshift.call(messages, prefix);
    }
    console.log.apply(console, messages);
};

graffiti.debug = function (message) {
    log(levels.debug, arguments);
};

graffiti.info = function (message) {
    log(levels.info, arguments);
};

graffiti.warn = function (message) {
    log(levels.warn, arguments);
};

graffiti.error = function (message) {
    log(levels.error, arguments);
};

/**
 *  Custom express logger based upon express.logger('dev')
 */
graffiti.express = function (express) {
    //concise output colored by response status for development use
    return express.logger(function (tokens, req, res) {
        var status = res.statusCode
            , len = parseInt(res.getHeader('Content-Length'), 10)
            , color = 32;

        if (status >= 500) color = 31
        else if (status >= 400) color = 33
        else if (status >= 300) color = 36;

        len = isNaN(len)
            ? ''
            : len = ' - ' + bytes(len);

        return levels.debug + ' \033[90m' + req.method
            + ' ' + req.originalUrl + ' '
            + '\033[' + color + 'm' + res.statusCode
            + ' \033[90m'
            + (new Date - req._startTime)
            + 'ms' + len
            + '\033[0m';
    });
};