import crypto from 'crypto';
import otpGenerator from 'otp-generator';

export const createRandomBytes = (count: number = 40): string => {
  return crypto.randomBytes(count).toString('hex');
};

export const hashString = (string: string): string => {
  return crypto.createHash('sha256').update(string, 'utf8').digest('hex');
};

export const createRandomOtp = (length: number = 6): string => {
  return otpGenerator.generate(length, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
};
