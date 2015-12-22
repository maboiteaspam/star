#!/usr/bin/env node

function usage () {/*

    Usage
        star [opts]

    Options
        -v             verbose
        -h             show help

    Examples
        star -v
        star -h
*/}

var argv  = require('minimist')(process.argv.slice(2));
var debug = require('@maboiteaspam/set-verbosity')('star', process.argv);
var pkg   = require('./package.json')
var help  = require('@maboiteaspam/show-help')(usage, process.argv, pkg);

// (!argv['_'] || !!argv['_']) && help.print(usage, pkg) && help.die();
