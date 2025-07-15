import { body } from 'express-validator';
import {
    isFirstName,
    isLastName,
    isEmail,
    isPassword
} from './custom.validators';


export const validationErrors = (errors) => {
    const validationErrors = {};

    errors.array().forEach((error) => {
        if ('path' in error && 'msg' in error) {
            validationErrors[error.path] = error.msg;
        }
    });

    return validationErrors;
}

export const signupAdminValidator = [
    body("first_name")
        .custom(isFirstName).withMessage("Invalid first name"),
    body("last_name")
        .custom(isLastName).withMessage("Invalid last name"),
    body("email")
        .custom(isEmail).withMessage("Invalid email address"),
    body("password")
        .custom(isPassword).withMessage(
            "Password must be exactly 8 characters, include at least 1 number, 1 special character, and at least 6 letters"
        ),
];

export const signupUserValidator = [
    
]

export const loginValidator = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password is required")
];