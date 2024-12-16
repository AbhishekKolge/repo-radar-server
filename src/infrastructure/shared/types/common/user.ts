export interface TokenUser {
  id: string;
  githubToken: string;
}

export interface AuthUser {
  id: string;
  githubToken: string;
  isTestUser: boolean;
}
