#!/usr/bin/env node

function usage () {/*

    Usage
        star [cmd] [opts]
        star add [modules...]
        star rm [modules...]
        star ll

    Options
        -v|--verbose    verbose
        -d|--dev        --save-dev
        -h|--help       show help

    Examples
        star add debug -v
        star add debug -d
        star rm debug -v
        star ll debug -v
        star -v
        star -h
*/}

var argv  = require('minimist')(process.argv.slice(2));
var debug = require('@maboiteaspam/set-verbosity')('star', process.argv);
var pkg   = require('./package.json')
var help  = require('@maboiteaspam/show-help')(usage, process.argv, pkg);
var Config= require('configstore') // see https://github.com/yeoman/configstore/pull/32
var conf = new Config(pkg.name, {save: [], savedev:[]});

(!argv['_'] || !argv['_'].length) && help.print(usage, pkg) && help.die('star [cmd] [opts]');

var cmd = argv['_'].shift()
var modules = [].concat(argv['_']);

(cmd!=='ll' && !modules.length) && help.print(usage, pkg) && help.die('Missing modules');

debug('%s', cmd)
debug('%j', modules)

function ll(dev) {
    var mods = dev ? conf.get('savedev') : conf.get('save')
    return (mods.join(' ') || 'empty') + '\n'
}

function add(dev, modules) {
    var mods = dev ? conf.get('savedev') : conf.get('save')
    var l = mods.length;
    mods = mods.concat(modules).filter(function(elem, pos) {return mods.indexOf(elem)!==pos;})
    dev ? conf.set('savedev', mods) : conf.set('save', mods)
    return JSON.stringify(mods.length!==l)
}

function rm(dev, modules) {
    var found = false
    var mods = dev ? conf.get('savedev') : conf.get('save')
    modules.map(function (m) {
        var k = mods.indexOf(m);
        k >-1 && mods.splice(k, 1);
        found = (!found && k >-1) || found;
    });
    dev ? conf.set('savedev', mods) : conf.set('save', mods)
    return JSON.stringify(found)
}

var isDev = argv.d || argv.dev;

debug('isDev %j', !!isDev)

if (cmd==='rm') process.stdout.write(rm(isDev, modules))
else if (cmd==='add') process.stdout.write(add(isDev, modules))
else process.stdout.write(ll(isDev))
