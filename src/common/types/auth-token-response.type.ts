export interface TokenResponse {
  token: string;
  expires: Date;
}
export interface AuthTokensResponseType {
  access: TokenResponse;
  refresh?: TokenResponse;
}
