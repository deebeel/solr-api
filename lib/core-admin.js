"use strict";

const request = require("request");
const util = require("util");
const extend = util._extend;
const assert = require("assert");
const STATUS = "STATUS";
const CREATE = "CREATE";
const RELOAD = "RELOAD";
const RENAME = "RENAME";
const SWAP = "SWAP";
const UNLOAD = "UNLOAD";
const LOAD = "LOAD";//not implemented yet
const MERGE_INDEXES = "MERGEINDEXES";
const SPLIT = "SPLIT";


function CoreAdmin(uri) {
    if (!(this instanceof CoreAdmin)) {
        return new CoreAdmin(uri);
    }
    this._solrUri = util.format("%s/solr/admin/cores", uri || "http://localhost:8983");
}

CoreAdmin.prototype.exec = function (command, callback) {
    const qs = extend({}, command);
    const opts = {
        qs: qs,
        uri: this._solrUri
    };
    const requestCallback = callback &&
        function solrResponse(err, resp, body) {
            if (err || resp.statusCode >= 300) {
                return callback(err || body);
            }

            callback(null, body);
        };

    return request(opts, requestCallback);
};


module.exports = CoreAdmin;


function Unload(core, unloadOpts) {
    if (!(this instanceof Unload)) {
        return new Unload(core, unloadOpts)
    }
    assert.ok(core, "the target core has to be defined");
    this.action = UNLOAD;
    this.core = core;
    if (util.isBoolean(unloadOpts)) {
        this.deleteInstanceDir = unloadOpts;
    } else if (util.isObject(unloadOpts)) {
        this.deleteIndex = unloadOpts.deleteIndex;
        this.deleteDataDir = unloadOpts.deleteDataDir;
    }
}
module.exports.Unload = Unload;

function Swap(source, target) {
    if (!(this instanceof Swap)) {
        return new Swap(source, target);
    }
    assert.ok(source && target, "Both the source and the target core have to be defined");
    this.action = SWAP;
    this.core = source;
    this.other = target;
}
module.exports.Swap = Swap;

function Rename(source, target) {
    if (!(this instanceof Rename)) {
        return new Rename(source, target);
    }
    Swap.call(this);
    this.action = RENAME;
}
module.exports.Rename = Rename;

function Status(core) {
    if (!(this instanceof Status)) {
        return new Status();
    }
    this.action = STATUS;
    if (util.isString(core)) {
        this.core = core;
    }
}
module.exports.Status = Status;

function Reload(core) {
    if (!(this instanceof Reload)) {
        return new Reload();
    }
    this.action = RELOAD;
    if (util.isString(core)) {
        this.core = core;
    }
}
module.exports.Reload = Reload;


