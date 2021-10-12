import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {getUserId} from "@functions/utils";
import {deleteCollection} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('deleteCollection');

// Delete a collection for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('deleteCollection processing event: ', event);
    const collectionId = event.pathParameters.collectionId;
    await deleteCollection(getUserId(event), collectionId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("deleteCollection", startTime, endTime);
    await createSuccessMetric("deleteCollection");

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
