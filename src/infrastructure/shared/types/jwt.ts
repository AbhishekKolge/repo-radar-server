import { JwtPayload as JwtVerifyPayload } from 'jsonwebtoken';

export interface JwtPayload extends JwtVerifyPayload {
  id: string;
}
