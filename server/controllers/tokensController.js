const { Router, json } = require("express");
const { jwt } = require("twilio");
const AccessToken = jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const { twilio } = require("../config");

const router = Router();

router.use(json());

router.post("/", (req, res) => {
  const identity = req.body.identity;
  const roomName = req.body.roomName;

  const accessToken = new AccessToken(
    twilio.accountSid,
    twilio.apiKey,
    twilio.apiSecret,
    {
      identity,
    }
  );
  const videoGrant = new VideoGrant({
    room: roomName,
  });

  accessToken.addGrant(videoGrant);
  res.json({ token: accessToken.toJwt(), identity, roomName });
});

module.exports = router;
