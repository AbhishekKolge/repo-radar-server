import { Strategy as GitHubStrategy } from 'passport-github2';
import { ExtendedGithubProfileDto, GithubProfileDto } from '../types';
import { env } from 'src/infrastructure/config';

export const githubStrategy = new GitHubStrategy(
  {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: env.GITHUB_CALLBACK_URL,
  },
  (
    accessToken: string,
    _refreshToken: string,
    profile: ExtendedGithubProfileDto,
    done: (error: Error | null, githubProfile?: GithubProfileDto) => void,
  ) => {
    const githubProfile = {
      name: profile.displayName || profile._json.name || profile.username,
      username: profile.username || profile._json.login || '',
      profileImageUrl: profile.photos?.length ? profile.photos[0].value : profile._json.avatar_url,
      accessToken,
    };

    return done(null, githubProfile);
  },
);
