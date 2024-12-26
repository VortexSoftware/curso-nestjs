const env = process.env;
export enum RoleEnum {
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
}

export const messagingConfig = {
  emailSender: env.EMAIL_SENDER,
  apiKey: env.MAILJET_API_KEY,
  secret: env.MAILJET_SECRET_KEY,
  resetPasswordUrls: {
    backoffice: env.BACKOFFICE_RESET_PASSWORD_URL,
  },
};
