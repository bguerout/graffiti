var graffiti = require('./../index.js')();

graffiti.debug("dsdds");
graffiti.info("dsdds");
graffiti.warn("dsdds");
graffiti.error("dsdds");

var prod = require('./../index.js')({withColor:false});
prod.debug("dsdds");
prod.info("dsdds");
prod.warn("dsdds");
prod.error("dsdds");
