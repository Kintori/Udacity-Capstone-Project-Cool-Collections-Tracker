import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {UpdateCollectedItemRequest} from "../../requests/UpdateCollectedItemRequest";
import {getUserId} from "@functions/utils";
import {updateCollectedItem} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('updateCollectedItem');

// Update a collected item for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('updateCollectedItem processing event: ', event);
    const itemId = event.pathParameters.id;
    const updatedCollectedItem : UpdateCollectedItemRequest = typeof event.body === "object" ? event.body : JSON.parse(event.body);
    await updateCollectedItem(getUserId(event), itemId, updatedCollectedItem);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("updateCollectedItem", startTime, endTime);
    await createSuccessMetric("updateCollectedItem");

    return {
      statusCode: 200,
      body: ''
    }
  });

handler
    .use(httpErrorHandler())
    .use(
  cors({
    credentials: true
  })
);
