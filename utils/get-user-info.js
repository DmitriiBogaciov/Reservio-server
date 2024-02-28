async function getUserInfo(accessToken) {
  try {
    const response = await fetch('https://dev-3bvkk0hsrquz68yn.us.auth0.com/userinfo', {
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