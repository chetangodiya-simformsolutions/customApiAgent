import * as Yup from 'yup';
import { Strings } from '../constants';

/**
 * A validation schema for the sign in form.
 * @returns {Yup.ObjectSchema}
 */
export const SigninFormSchema = Yup.object().shape({
  email: Yup.string()
    .required(Strings.YupError.requireEmailError)
    .email(Strings.YupError.invalidEmailError),
  password: Yup.string()
    .required(Strings.YupError.requirePasswordError)
});
