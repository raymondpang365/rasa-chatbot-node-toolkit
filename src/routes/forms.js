import FormNames from '../constants/FormNames';
import formValidationController from '../controllers/formValidation';
import bodyParser from '../middlewares/bodyParser';

export default app => {
  // form
  app.post(
    `/api/forms/${FormNames.USER_REGISTER}/fields/email/validation`,
    bodyParser.json,
    formValidationController[FormNames.USER_REGISTER].email
  );
  app.post(
    `/api/forms/${FormNames.USER_VERIFY_EMAIL}/fields/email/validation`,
    bodyParser.json,
    formValidationController[FormNames.USER_VERIFY_EMAIL].email
  );
  app.post(
    `/api/forms/${FormNames.USER_FORGET_PASSWORD}/fields/email/validation`,
    bodyParser.json,
    formValidationController[FormNames.USER_FORGET_PASSWORD].email
  );
};
