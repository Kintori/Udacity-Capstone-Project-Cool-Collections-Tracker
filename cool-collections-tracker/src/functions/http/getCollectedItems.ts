import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {getCollectedItemsForCollection} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('getCollectedItems');

// Get all collected items for a single collection
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('getCollectedItems processing event: ', event);
    const collectionId = event.pathParameters.id;
    const collectedItems = await getCollectedItemsForCollection(collectionId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("getCollectedItems", startTime, endTime);
    await createSuccessMetric("getCollectedItems");

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: collectedItems
      })
    }
  });

handler.use(
  cors({
    credentials: true
  })
);
