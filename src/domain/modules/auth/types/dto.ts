import { Profile } from 'passport-github2';

export interface GithubProfileDto {
  name?: string;
  username: string;
  profileImageUrl?: string;
  accessToken: string;
}

export interface ExtendedGithubProfileDto extends Profile {
  _json: {
    avatar_url?: string;
    name?: string;
    login?: string;
  };
}
