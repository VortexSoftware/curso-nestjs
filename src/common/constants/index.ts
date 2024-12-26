const env = process.env;
export enum RoleEnum {
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
}

export const messagingConfig = {
  emailSender: env.EMAIL_SENDER,
  apiKey: env.MAILJET_API_KEY,
  secret: env.MAILJET_SECRET_KEY,
  registerUserUrls: {
    backoffice: env.BACKOFFICE_RESET_PASSWORD_URL,
  },
  resetPasswordUrls: {
    backoffice: env.BACKOFFICE_RESET_PASSWORD_URL,
    app: env.APP_RESET_PASSWORD_URL,
  },
};
