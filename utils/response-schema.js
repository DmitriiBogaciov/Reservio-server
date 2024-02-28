const getDefaultResponse = () => ({
  message: "",
  response_code: 200,
  result: {}
});

const GetResponse = (message, response_code, data) => {
  const response = getDefaultResponse();

  return {
    message: message !== undefined ? message : response.message,
    response_code: response_code !== undefined ? response_code : response.response_code,
    result: data !== undefined ? data : response.result
  };
}

module.exports = GetResponse;