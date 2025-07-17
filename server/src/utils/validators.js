import { body } from 'express-validator';
import {
    isFirstName,
    isLastName,
    isMiddleName,
    isEmail,
    isPassword,
    isRole,
    isSuffix,
    isGender,
    isRegion,
    isProvince,
    isMunicipality,
    isBarangay,
    isAge
} from './custom.validators.js';


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
    body("role")
        .custom(isRole).withMessage(
            'Role must be either "super_sk_admin" or "natural_sk_admin"'
        )
];

export const signupYouthValidator = [
    body("email")
        .custom(isEmail).withMessage("Invalid Email"),
    body("password")
        .custom(isPassword).withMessage("Password must be exactly 8 characters, include at least 1 number, 1 special character, and at least 6 letters"),
    body("first_name")
        .custom(isFirstName).withMessage("Invalid First Name"),
    body("last_name")
        .custom(isLastName).withMessage("Invalid Last Name"),
    body("middle_name")
        .custom(isMiddleName).withMessage("Invalid Middle Name"),
    body("suffix")
        .custom(isSuffix).withMessage("Invalid Suffix"),
    body("gender")
        .custom(isGender).withMessage("Invalid Gender"),
    body("region")
        .custom(isRegion).withMessage("Invalid Region"),
    body('province')
        .custom(isProvince).withMessage("Invalid Province"),
    body("municipality")
        .custom(isMunicipality).withMessage("Invalid Municipality"),
    body("barangay")
        .custom(isBarangay).withMessage("Invalaid Barangay"),
    body("age")
        .custom(isAge).withMessage("Invalid Age")
]

export const loginValidator = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password is required")
];