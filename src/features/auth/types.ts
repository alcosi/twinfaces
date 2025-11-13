export type AuthUser = {
  userId?: string;
  domainId?: string;
  authToken?: string;
  authTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
};
