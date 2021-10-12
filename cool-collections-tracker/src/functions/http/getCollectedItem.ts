import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {getUserId} from "@functions/utils";
import {getCollectedItem} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('getCollectedItem');

// Get one collected item
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('getCollectedItem processing event: ', event);
    const itemId = event.pathParameters.id;
    const collectedItem = await getCollectedItem(getUserId(event), itemId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("getCollectedItem", startTime, endTime);
    await createSuccessMetric("getCollectedItem");

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: collectedItem[0]
      })
    }
  });

handler.use(
  cors({
    credentials: true
  })
);
