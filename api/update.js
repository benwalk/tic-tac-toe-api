import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: "ttt-games",
        Key: {
          gameId: event.pathParameters.id
        },
        UpdateExpression:
          "SET #status = :status, players = :players, #state = :state",
        ExpressionAttributeNames: {
          "#status": "status",
          "#state": "state"
        },
        ExpressionAttributeValues: {
          ":status": data.status ? data.status : null,
          ":players": data.players ? data.players : null,
          ":state": data.state ? data.state : null
        },
        ReturnValues: "ALL_NEW"
    };

    try {
        const result = await dynamoDbLib.call("update", params);
        callback(null, success({ status: true }));
    }
    catch (e) {
        console.log(`Error (${e.statusCode}): ${e.message}`);
        callback(null, failure({ status: false }));
    }
}
