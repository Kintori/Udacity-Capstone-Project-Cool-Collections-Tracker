import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateCollectionRequest } from '../../requests/CreateCollectionRequest'
import {getUserId} from "@functions/utils";
import {createCollection} from "../../utils/businessLayer";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('createCollection');

// Create a collection for a single user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('createCollection processing event: ', event);

    const newCollection : CreateCollectionRequest = typeof event.body === "object" ? event.body : JSON.parse(event.body);
    const newItem = await createCollection(getUserId(event), newCollection);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("createCollection", startTime, endTime);
    await createSuccessMetric("createCollection");

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
