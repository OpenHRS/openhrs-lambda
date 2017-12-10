// environment variables
var url  = process.env.ELASTIC_URL,
    user = process.env.AWS_KEY,
    pass = process.env.AWS_SEC;

var es = require('elasticsearch').Client({
    hosts: [ url ],
    connectionClass: require('http-aws-es')
});

var AWS = require('aws-sdk');
AWS.config.update({
  credentials: new AWS.Credentials(user, pass),
  region: 'us-west-1'
});

exports.handler = (event, context, callback) => {
    es.search({
        index: 'hrs',
        type: 'statutes',
        body: {
            sort: [
                {year_num: "asc"}
            ],
            query: {
                bool: {
                    filter: [
                        { term: {div_num: event["queryStringParameters"]["div"]}},
                        { term: {title_num: event["queryStringParameters"]["title"]}},
                        { term: {chapt_num: event["queryStringParameters"]["chapt"]}},
                        { term: {sec_num: event["queryStringParameters"]["sec"]}}
                    ]
                }
            }            
        }
    }, function(err, res) {
        var response = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            "body": JSON.stringify(res.hits.hits)
        };

        var response_error = {
            "isBase64Encoded": false,
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : true
            },
            "body": JSON.stringify(err)
        };

        if (err)
            callback(null, err)
        else
            callback(null, response);
    });
};
