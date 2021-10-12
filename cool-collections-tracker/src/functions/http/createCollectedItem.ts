import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import {CreateCollectedItemRequest} from "../../requests/CreateCollectedItemRequest";
import {getUserId} from "@functions/utils";
import {createCollectedItem} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('createCollectedItem');

// Create a collection for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const startTime = new Date().getTime();

    logger.info('createCollectedItem processing event: ', event);
    const collectionId = event.pathParameters.id;

    const newCollectedItem : CreateCollectedItemRequest = typeof event.body === "object" ? event.body : JSON.parse(event.body);
    const newItem = await createCollectedItem(getUserId(event), collectionId, newCollectedItem);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("createCollectedItem", startTime, endTime);
    await createSuccessMetric("createCollectedItem");

    return {
      statusCode: 201,
      body: JSON.stringify({
        item: newItem
      })
    }
  });

handler.use(
  cors({
    credentials: true
  })
);
