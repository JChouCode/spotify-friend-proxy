const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let spDcCookie = process.env.SP_DC;

app.get('/friends', async (req, res) => {
  try {
    const { accessToken } = await getWebAccessToken(spDcCookie);
    const friendActivity = await getFriendActivity(accessToken);
    res.json(friendActivity.friends);
  } catch (err) {
    return res.status(500).json({ type: 'error', message: err.message });
  }
});

async function getWebAccessToken(spDcCookie) {
  const res = await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', {
    headers: {
      Cookie: `sp_dc=${spDcCookie}`
    }
  })

  return res.json()
}

async function getFriendActivity(webAccessToken) {
  const res = await
    fetch('https://guc-spclient.spotify.com/presence-view/v1/buddylist', {
      headers: {
        Authorization: `Bearer ${webAccessToken}`
      }
    })

  return res.json()
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));