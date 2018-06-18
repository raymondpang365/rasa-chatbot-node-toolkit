import { jwt } from '../../../config';
import Roles from '../../../constants/Roles';
import bodyParser from '../../middlewares/bodyParser';
import { jwtAuth } from '../../middlewares/jwtAuth';
import mailController from '../../controllers/mail';
import roleRequired from '../../middlewares/roleRequired';
import validate from '../../middlewares/validate';
import fileUpload from '../../middlewares/fileUpload';
import userController from '../../controllers/user';

export default app => {
  // user

  app.post(
    '/api/users',
    bodyParser.json,
    validate.recaptcha,
    userController.emailRegister,
    mailController.sendVerification
  );

  app.post(
    '/api/users/email/verify',
    bodyParser.json,
    bodyParser.jwt('verifyEmailToken', jwt.verifyEmail.secret),
    validate.verifyUserNonce('verify_email_nonce'),
    userController.verifyEmail
  );
  app.post(
    '/api/users/email/request-verify',
    bodyParser.json,
    validate.form('user/VerifyEmailForm'),
    validate.recaptcha,
    userController.emailSetNonce('verifyEmail')
  );
  app.post('/api/users/emaillogin', bodyParser.json, userController.emailLogin);
  app.post(
    '/api/users/password/request-reset',
    bodyParser.json,
    validate.form('user/ForgetPasswordForm'),
    validate.recaptcha,
    userController.emailSetNonce('resetPassword')
  );
  app.put(
    '/api/users/password',
    bodyParser.json,
    bodyParser.jwt('resetPasswordToken', jwt.resetPassword.secret),
    validate.verifyUserNonce('resetPassword'),
    validate.form('user/ResetPasswordForm'),
    userController.emailResetPassword
  );
  // jwt required for the following:
  app.get(
    '/api/users/',
    jwtAuth,
    roleRequired([Roles.ADMIN]),
    userController.list
  );

  app.get('/api/users/logout', jwtAuth, userController.logout);
  app.get('/api/users/me', jwtAuth, userController.readSelf);
  app.put(
    '/api/users/me',
    jwtAuth,
    bodyParser.json,
    validate.form('user/EditForm'),
    userController.update
  );
  app.put(
    '/api/users/me/avatarURL',
    jwtAuth,
    bodyParser.json,
    userController.updateAvatarURL
  );
  app.put(
    '/api/users/me/password',
    jwtAuth,
    bodyParser.json,
    validate.form('user/ChangePasswordForm'),
    userController.emailUpdatePassword
  );
  app.post(
    '/api/users/me/avatar',
    jwtAuth,
    fileUpload
      .disk({
        destination: 'tmp/{userId}',
        filename: 'avatar.jpg'
      })
      .fields([{ name: 'avatar' }]),
    validate.form('user/AvatarForm'),
    userController.uploadAvatar
  );
};
