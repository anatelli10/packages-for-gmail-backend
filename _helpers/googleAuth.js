const axios = require('axios');
const querystring = require('querystring');
const { google } = require('googleapis');
const { googleClientId, googleClientSecret } = require('config.json');

module.exports = { getAccessToken, getToken, getAuthURL };

const oauth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientSecret,
    `http://localhost:4000/accounts/auth/callback`
);

async function getToken(code) {
    return oauth2Client.getToken(code);
}

async function getAccessToken(refresh_token) {
    const params = {
        client_id: googleClientId,
        client_secret: googleClientSecret,
        refresh_token,
        grant_type: 'refresh_token'
    };

    return axios.post(
        'https://oauth2.googleapis.com/token',
        querystring.stringify(params),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
}

function getAuthURL(email) {
    /*
     * Generate a url that asks permissions to the user's email and profile
     */
    const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/gmail.readonly'
    ];

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: scopes,
        state: `{"emailAddress":"${email}"}`,
        login_hint: email
    });
}
