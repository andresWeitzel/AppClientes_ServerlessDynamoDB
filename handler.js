'use strict';

module.exports.hello = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: process.env.HELLO_TEST,
        input: event,
      },
      null,
      2
    ),
  };

};
