let test = require('./index.js');

let event = {
    "size": 1,
    "input": "1-26"
};

let context = {};

let callback = function(error, data) {
    console.log(data)
}

test.handler(event, context, callback);
