const { createVercelBeginHandler } = require('netlify-cms-oauth-provider-node');

module.exports = createVercelBeginHandler({}, { useEnv: true });