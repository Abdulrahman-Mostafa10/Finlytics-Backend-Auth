import dotenv from "dotenv";

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || "development",

  server: {
    port: process.env.PORT as string || 3000,
  },

  database: {
    uri: process.env.MONGO_URI as string,
  },

  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY as string,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY as string, 
    verificationTokenSecret: process.env.VERIFICATION_TOKEN_SECRET as string,
  },

  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY as string,
    senderEmail: process.env.SENDGRID_SENDER_EMAIL as string,
  },

  admins: [
    {
      email: process.env.ADMIN_1_EMAIL as string,
      password: process.env.ADMIN_1_PASSWORD as string,
    },
    {
      email: process.env.ADMIN_2_EMAIL as string,
      password: process.env.ADMIN_2_PASSWORD as string,
    },
    {
      email: process.env.ADMIN_3_EMAIL as string,
      password: process.env.ADMIN_3_PASSWORD as string,
    },
  ],
};
