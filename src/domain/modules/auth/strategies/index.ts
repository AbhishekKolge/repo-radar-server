import passport from 'passport';
import { githubStrategy } from './github';

passport.use(githubStrategy);

export { passport };
