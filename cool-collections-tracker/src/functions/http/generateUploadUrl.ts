import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import {createAttachmentPresignedUrl} from "../../utils/attachmentUtils";
import {createLatencyMetric, createLogger, createSuccessMetric} from "../../utils/logger";

const logger = createLogger('generateUploadUrl');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const startTime = new Date().getTime();

    logger.info('generateUploadUrl processing event: ', event);
    const itemId = event.pathParameters.itemId;
    // Return a presigned URL to upload a file for a collected item with the provided id
    const url = createAttachmentPresignedUrl(itemId);

    // Metrics
    const endTime = new Date().getTime();
    await createLatencyMetric("generateUploadUrl", startTime, endTime);
    await createSuccessMetric("generateUploadUrl");

    return {
    statusCode: 201,
    body: JSON.stringify({
      uploadUrl: url
    })
  }
  }
);

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  );


