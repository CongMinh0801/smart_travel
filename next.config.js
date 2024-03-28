const dotenv = require('dotenv');

dotenv.config();

module.exports = {

    env: {
        BASE_API_URL: process.env.BASE_API_URL,
    },
  };
