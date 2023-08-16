import nodemailer from 'nodemailer';
import { google } from 'googleapis';

type emailOption = {
  subject: string;
  text?: string;
  html?: string;
};

const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET_ID = process.env.CLIENT_SECRET_ID;
const CLIENT_REDIRECT_URI = process.env.CLIENT_REDIRECT_URI;
const CLIENT_REFRESH_TOKEN = process.env.CLIENT_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET_ID,
  CLIENT_REDIRECT_URI
);

oAuth2Client.setCredentials({
  refresh_token: CLIENT_REFRESH_TOKEN,
});

const sendMail = async (email: string, option: emailOption) => {
  try {
    const accessToken = oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'oAuth2',
        user: CLIENT_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET_ID,
        refreshToken: CLIENT_REFRESH_TOKEN,
        accessToken,
      },
    });

    const mailOption = {
      from: `Harsh ${CLIENT_EMAIL}`,
      to: email,
      subject: option.subject,
      text: option.text,
      html: option.html,
    };

    const result = await transport.sendMail(mailOption);

    return result;
  } catch (error) {
    console.log('Send Mail Error :::::::', { error });
  }
};

export default sendMail;
