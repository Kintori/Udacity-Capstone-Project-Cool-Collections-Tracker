import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import {getUserId} from "@functions/utils";
import {getCollectionsForUser} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('getCollections');

// Get all collections for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('getCollections processing event: ', event);
    const collections = await getCollectionsForUser(getUserId(event));

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("getCollections", startTime, endTime);
    await createSuccessMetric("getCollections");

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: collections
      })
    }
  });

handler.use(
  cors({
    credentials: true
  })
);
