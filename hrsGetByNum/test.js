let test = require('./index.js');

let event = {
    "queryStringParameters": {
        "div": "1",
        "title": "1",
        "chapt": "1",
        "sec": "1"
    }
};

let context = {};

let callback = function(error, data) {
    console.log(data)
}

test.handler(event, context, callback);
