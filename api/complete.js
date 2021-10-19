const { createVercelCompleteHandler } = require('netlify-cms-oauth-provider-node');

module.exports = createVercelCompleteHandler({}, { useEnv: true });