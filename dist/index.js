"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mymariadb_class_1 = __importDefault(require("./lib/mymariadb.class"));
/**
 * @function asdf
 * ini asdf
 */
module.exports = (param) => {
    return new mymariadb_class_1.default(param);
};
