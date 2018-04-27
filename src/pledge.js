"use strict";
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:

function $Promise(executor) {
  if (typeof executor !== "function") throw TypeError(/executor.+function/i);
  this._state = "pending";
  this._value;
  this._handlerGroups = [];
  executor(this._internalResolve.bind(this), this._internalReject.bind(this));
}
$Promise.prototype._internalResolve = function(data) {
  if (this._state !== "fulfilled" && this._state !== "rejected") {
    this._state = "fulfilled";
    this._value = data;
  }
};

$Promise.prototype._internalReject = function(data) {
  if (this._state !== "rejected" && this._state !== "fulfilled") {
    this._state = "rejected";
    this._value = data;
  }
};

$Promise.prototype.then = function(successCb, errorCb) {
  if (typeof successCb !== "function") successCb = null;
  if (typeof errorCb !== "function") errorCb = null;
  this._handlerGroups.push({
    successCb,
    errorCb
  });
  return this._callHandlers();
};

$Promise.prototype._callHandlers = function() {
  let len = this._handlerGroups.length - 1;
  let success = this._handlerGroups[len].successCb;
  let error = this._handlerGroups[len].errorCb;
  if (this._state === "fulfilled" && success) return success(this._value);
  if (this._state === "fulfilled" && error) return error(this._value);
};

/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
