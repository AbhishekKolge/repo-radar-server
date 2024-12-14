import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const register = (_req: Request, res: Response) => {
  //   const verificationCode = createRandomOtp();
  //   console.log({ verificationCode });
  //   const { contactCountryId, ...userDetails } = req.body;
  //   const userModel = new User({
  //     ...userDetails,
  //     verificationCode: hashString(verificationCode),
  //     verificationCodeExpiration: getCodeExpirationTimeOffset(),
  //     loginMethod: LOGIN_METHOD.normal,
  //   });
  //   if (contactCountryId) {
  //     userModel.contactCountry = {
  //       connect: { id: contactCountryId },
  //     };
  //   }
  //   await userModel.encryptPassword();
  //   userModel.createPreference();
  //   const user = await prisma.user.create({
  //     data: userModel.model,
  //   });
  //   await sendVerificationEmail({
  //     name: user.name,
  //     email: user.email,
  //     verificationCode,
  //   });
  //   res.status(StatusCodes.CREATED).json({
  //     msg: `Email verification code sent to ${user.email}`,
  //   });

  res.status(StatusCodes.CREATED);
};
