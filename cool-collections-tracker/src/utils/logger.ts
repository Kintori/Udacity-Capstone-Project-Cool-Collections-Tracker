import * as winston from 'winston'
import * as AWS from 'aws-sdk'

const cloudwatch = new AWS.CloudWatch();

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
export function createLogger(loggerName: string) {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { name: loggerName },
    transports: [
      new winston.transports.Console()
    ]
  })
}

export async function createLatencyMetric(lambdaName: string, startTime: number, endTime: number) {
  const totalTime = endTime - startTime
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Latency',
        Dimensions: [
          {
            Name: 'LambdaName',
            Value: lambdaName
          }
        ],
        Unit: 'Milliseconds',
        Value: totalTime
      }
    ],
    Namespace: 'CoolCollectionsTracker/Serverless'
  }).promise()
}

export async function createSuccessMetric(lambdaName: string) {
  await cloudwatch.putMetricData({
    MetricData: [
      {
        MetricName: 'Success',
        Dimensions: [
          {
            Name: 'LambdaName',
            Value: lambdaName
          }
        ],
        Unit: 'Count',
        Value: 1
      }
    ],
    Namespace: 'CoolCollectionsTracker/Serverless'
  }).promise()
}