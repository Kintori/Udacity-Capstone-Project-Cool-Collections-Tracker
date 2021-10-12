import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import {cors, httpErrorHandler} from 'middy/middlewares'
import {UpdateCollectionRequest} from "../../requests/UpdateCollectionRequest";
import {getUserId} from "@functions/utils";
import {updateCollection} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('updateCollection');

// Update a collection for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('updateCollection processing event: ', event);
    const collectionId = event.pathParameters.collectionId;
    const updatedCollection : UpdateCollectionRequest = typeof event.body === "object" ? event.body : JSON.parse(event.body);
    await updateCollection(getUserId(event), collectionId, updatedCollection);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("updateCollection", startTime, endTime);
    await createSuccessMetric("updateCollection");

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
