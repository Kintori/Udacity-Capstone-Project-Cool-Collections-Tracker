// API id here so that the frontend can interact with it
const apiId = '71qz34a7e7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // Auth0 application values
  domain: 'gaziger.auth0.com',            // Auth0 domain
  clientId: 'ultYfc4qqkPnHicGDtF7HJG6crJZ3ZWf',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
