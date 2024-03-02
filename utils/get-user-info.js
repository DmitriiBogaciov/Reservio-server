async function getUserInfo(accessToken) {
  try {
    const response = await fetch(`${process.env.issuerBaseURL}userinfo`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    userInfo = await response.json();
    return userInfo;
  }
  catch (error) {
    throw error;
  }
}

module.exports = getUserInfo;