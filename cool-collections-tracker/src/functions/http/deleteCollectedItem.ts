import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {getUserId} from "@functions/utils";
import {deleteCollectedItem} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('deleteCollectedItem');

// Delete a collected item in a collection for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('deleteCollectedItem processing event: ', event);
    const itemId = event.pathParameters.id;
    await deleteCollectedItem(getUserId(event), itemId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("deleteCollectedItem", startTime, endTime);
    await createSuccessMetric("deleteCollectedItem");

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
