const request = require('request-promise');
const admin = require('firebase-admin');
const uuid = require('uuid-v4');
const serviceAccount = require('/Users/ps/Documents/KPS/testbot/line-bot-8761c-firebase-adminsdk-qm77w-6c3ffdc2c8.json');
const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer S7FyKvnP22GtVVPN0zDpCyEeh6Qli0LVh6+EN6q0MXNL68ZsTi9rNky/VoFGJAjMmZpFLoUdxwlYQUGRDyE5raXRrujgE73eZSdPM7/WVSF4wUPuuJPGKLxv+iX7hDlFkUuYW9aSoGmkLp7SnOa71wdB04t89/1O/w1cDnyilFU='
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "line-bot-8761c.appspot.com"
});

var bucket = admin.storage().bucket();
var filename = `/home/pi/linebot/img/${process.argv.slice(2)[0]}.jpg`

async function uploadFile() {
  const metadata = {
    metadata: {
      firebaseStorageDownloadTokens: uuid()
    },
    contentType: 'image/jpg',
    cacheControl: 'public, max-age=31536000',
  };

  const fileUpload = await bucket.upload(filename, {
    gzip: true,
    metadata: metadata,
    public: true
  });
}

async function getUrlFile(token) {
  const urlOptions = {
    version: "v4",
    action: "read",
    expires: Date.now() + 1000 * 60 * 2, // 2 minutes
  }

  bucket.file(`${token}.jpg`)
    .getSignedUrl(urlOptions).then(url => {
      reply(token, url[0]);
    });
}

async function lineBot(token) {
  await uploadFile().catch('uploadFile', console.error);
  await getUrlFile(token).catch('getUrlFile', console.error);
}

const reply = (Token, URL) => {
  console.log('URL 86 : ', URL);
  console.log('Token 88: ', Token)
  return request({
    method: POST,
    uri: `${LINE_MESSAGING_API}/reply`,
    headers: LINE_HEADER,
    body: JSON.stringify({
      replyToken: Token,
      messages: [
        {
          type: image,
          originalContentUrl: URL,
          previewImageUrl: URL
        }
      ]
    })
  });
};

lineBot(process.argv.slice(2)[0])

