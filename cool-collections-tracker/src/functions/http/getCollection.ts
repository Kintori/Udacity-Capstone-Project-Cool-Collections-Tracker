import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {getUserId} from "@functions/utils";
import {getCollection} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('getCollection');

// Get one collection for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('getCollection processing event: ', event);
    const collectionId = event.pathParameters.collectionId;
    const collection = await getCollection(getUserId(event), collectionId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("getCollection", startTime, endTime);
    await createSuccessMetric("getCollection");

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: collection[0]
      })
    }
  });

handler.use(
  cors({
    credentials: true
  })
);
