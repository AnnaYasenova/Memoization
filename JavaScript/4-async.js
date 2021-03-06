'use strict';

global.api = {};
api.fs = require('fs');

// args[0] - key
// args[args.length-1] - callback
const memoizeAsync = (lib, fnName) => {
  const fn = lib[fnName];
  const cache = {};
  console.log('override ' + fnName);
  lib[fnName] = (...args) => {
    console.dir({ call: fnName, args, cache });
    const cb = args.pop();
    const key = args[0];
    const record = cache[key];
    console.log('key: ' + key);
    console.log('cached: ' + record);
    if (record) {
      console.log('from cache');
      return cb(record.err, record.data);
    }
    fn(...args, (err, data) => {
      console.log('from file');
      console.log('Save key: ' + key);
      cache[key] = { err, data };
      console.dir({ cache });
      cb(err, data);
    });
  };
};

memoizeAsync(api.fs, 'readFile');

api.fs.readFile('4-async.js', (err, data) => {
  console.log('data length: ' + data.length);
  api.fs.readFile('4-async.js', (err, data) => {
    console.log('data length: ' + data.length);
  });
});
