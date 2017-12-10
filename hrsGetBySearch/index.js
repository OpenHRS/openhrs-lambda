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
            size: event["queryStringParameters"]["size"],
            query: {
                bool: {
                    should: [
                        {
                            match_phrase_prefix: {
                                sec_text: {
                                    query: event["queryStringParameters"]["input"],
                                    boost:7
                                }
                            }
                        },
                        {
                            match: {
                                section_text: {
                                query: event["queryStringParameters"]["input"],
                                fuzziness: 1,
                                boost:5
                                }
                            }
                        },
                        {
                            match: {
                                chapt_name: {
                                    query: event["queryStringParameters"]["input"],
                                    fuzziness: 1,
                                    boost: 5
                                }
                            }
                        },
                        {
                            match_phrase: {
                                chapt_sec: {
                                    query: event["queryStringParameters"]["input"],
                                    boost: 10
                                }
                            }
                        },
                        {
                            match: {
                                text: {
                                    query: event["queryStringParameters"]["input"],
                                    fuzziness: 1
                                }
                            }
                        },
                        {
                            common: {
                                query: event["queryStringParameters"]["input"]
                            }
                        },
                        {
                            match: {
                                chapt_num: {
                                    query: event["queryStringParameters"]["input"],
                                    boost: 9
                                }
                            }
                        },
                        {
                            match: {
                                sec_num: {
                                    query: event["queryStringParameters"]["input"],
                                    boost: 5
                                }
                            }
                        }
                    ],
                    filter: [
                        {term: { year: "current" }}
                    ],
                    minimum_should_match: 1
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
            callback(null, response_error);
        else
            callback(null, response);
    });
};
