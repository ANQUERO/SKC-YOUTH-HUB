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
            'Role must be either "super_official" or "natural_official"'
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
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true;
            return isMiddleName(value);
        }).withMessage("Invalid Middle Name"),
    body("suffix")
        .optional({ checkFalsy: true })
        .custom((value) => {
            if (!value || value.trim() === '') return true;
            return isSuffix(value);
        }).withMessage("Invalid Suffix"),
    body("gender")
        .custom(isGender).withMessage("Invalid Gender"),
    body("region")
        .custom(isRegion).withMessage("Invalid Region"),
    body('province')
        .custom(isProvince).withMessage("Invalid Province"),
    body("municipality")
        .custom(isMunicipality).withMessage("Invalid Municipality"),
    body("barangay")
        .custom(isBarangay).withMessage("Invalid Barangay"),
    body("age")
        .custom(isAge).withMessage("Invalid Age"),
    body("birthday")
        .notEmpty()
        .withMessage("Birthday is required")
        .isISO8601()
        .withMessage("Invalid birthday format")
        .custom((birthday, { req }) => {
            // Verify birthday is not in the future
            const birthDate = new Date(birthday);
            const today = new Date();
            if (birthDate > today) {
                throw new Error('Birthday cannot be in the future');
            }
            
            // If age is provided, verify they match
            if (req.body.age) {
                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    calculatedAge--;
                }
                
                const providedAge = parseInt(req.body.age, 10);
                // Age should match exactly (calculated age from birthday should match provided age)
                if (calculatedAge !== providedAge) {
                    throw new Error('Birthday and age do not match');
                }
            }
            return true;
        }).withMessage("Invalid birthday")
]

export const loginValidator = [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 8 }).withMessage("Password is required")
];

export const posts = async (req, res) => {
    body("description")
    .custom()
}