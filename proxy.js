const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

let spDcCookie = 'AQCgAtbxbFI8l4xV7FMGF7tSZe59B8Vs3IBhQt7utKxoS0PTbwBnVl3f0FLT8_LWkyLaoZSfNcAztOQGn8X48PNYo7Q3-ynDo98l5oaNXEdTZNvEO-Gqj_6B9yXZuPu0o5i5xRNt6XnNe0IOf-toN8mvCYqF_ZODf2v1dxS21S2N0M-oiLhT8Wmx-8P-lZFgmGhDSMKrGTYddlwTvB0yQCp_y3k4';

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