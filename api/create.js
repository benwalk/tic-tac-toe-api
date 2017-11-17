import uuid from "uuid";
import * as dynamoDbLib from "../libs/dynamodb-lib";
import { success, failure } from "../libs/response-lib";

export async function main(event, context, callback) {
    // Request body is passed in as a JSON encoded string in 'event.body'
    const data = JSON.parse(event.body);

    const params = {
        TableName: "ttt-games",
        Item: {
            gameId: uuid.v1(),
            status: data.status ? data.status : "NEW",
            players: data.players ? data.players : [],
            state: data.state ? data.state : {},
            createdAt: new Date().getTime()
        }
    };

    try {
        await dynamoDbLib.call("put", params);
        callback(null, success(params.Item));
    }
    catch (e) {
        console.log(`Error (${e.statusCode}): ${e.message}`);
        callback(null, failure({ status: false }));
    }
}
