# openhrs-lambda
Lambda functions for OpenHRS backend.

## API Gateway usage
### Search
https://bn8d8e4oc9.execute-api.us-west-1.amazonaws.com/prod/search?size=*num*&input=*input*
#### Output
Array of documents sorted by score in descending order where each document contains information about a statute.
### Get by chapter and section
https://bn8d8e4oc9.execute-api.us-west-1.amazonaws.com/prod/num?chapt=*chapter number*&sec=*section num*
#### Output
Array of documents specified by chapter and section sorted in descending order by year where each document contains information about a statute.
