const debounce = require('lodash/debounce');
const get = require('lodash/get');
const has = require('lodash/has');
const head = require('lodash/head');
const filter = require('lodash/filter');
const last = require('lodash/last');
const map = require('lodash/map');
const mapValues = require('lodash/mapValues');
const size = require('lodash/size');
const union = require('lodash/union');
const some = require("lodash/some");
const padStart  = require("lodash/padStart");
const uniq  = require("lodash/uniq");
const uniqBy  = require("lodash/uniqBy");
const set  = require("lodash/set");
const sumBy  = require("lodash/sumBy");
const orderBy  = require("lodash/orderBy");
const ceil  = require("lodash/ceil");
const add  = require("lodash/add");
const omit  = require("lodash/omit");
const concat  = require("lodash/concat");
const intersection  = require("lodash/intersection");
const extend  = require("lodash/extend");
const find  = require("lodash/find");
const assign  = require("lodash/assign");
const defaultsDeep  = require("lodash/defaultsDeep");

const lodash = require('lodash/wrapperLodash');
const baseForOwn = require('lodash/_baseForOwn');
const mixin = require('lodash/mixin');

// Add methods that return wrapped values in chain sequences.
lodash.sortBy = require('lodash/sortBy');
lodash.filter = require('lodash/filter');

// Add methods to `lodash.prototype`.
mixin(lodash, lodash);

// Add methods that return unwrapped values in chain sequences.
lodash.replace = require('lodash/replace');
lodash.trimEnd = require('lodash/trimEnd');

mixin(lodash, (function() {
    const source = {};
    baseForOwn(lodash, function(func : any, methodName : any) {
        if (!source.hasOwnProperty.call(lodash.prototype, methodName)) {
            source[methodName] = func;
        }
    });
    return source;
}()), { 'chain': false });

// Add chain sequence methods to the `lodash` wrapper.
lodash.prototype.chain = require('lodash/wrapperChain');
lodash.prototype.value = require('lodash/wrapperValue');


/**
 * Export Loadsh Functions
 */
export {has , get , debounce  , size, map, union, head , last , some , padStart , uniq , set, orderBy ,
    ceil  ,add, lodash, mapValues , omit, concat, intersection, sumBy,
    extend, find, filter, assign, defaultsDeep, uniqBy
}

/**
 * Get Value Helper Function
 * 
 * @param object 
 * @param key 
 * @param deafultValue 
 */
export function getValue(object: any, key: any, deafultValue: any = ''){
    return get(object, key, deafultValue);
}

/**
 * Has Value Helper Function
 * 
 * @param object 
 * @param key 
 */
export function hasValue(object: any, key: any){
    return has(object, key)
}