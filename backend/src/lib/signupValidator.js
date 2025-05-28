import { body } from 'express-validator';

export const signupValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email'),

    body('region').notEmpty().withMessage('Region is required'),
    body('province').notEmpty().withMessage('Province is required'),
    body('municipality').notEmpty().withMessage('Municipality is required'),
    body('barangay').notEmpty().withMessage('Barangay is required'),

    body('gender')
        .notEmpty().withMessage('Gender is required')
        .isIn(['male', 'female']).withMessage('Gender must be male or female'),

    body('age')
        .notEmpty().withMessage('Age is required')
        .isInt({ min: 13 }).withMessage('Age must be a valid number'),

    body('contact')
        .notEmpty().withMessage('Contact is required')
        .isLength({ min: 10, max: 15 }).withMessage('Contact must be 10-15 digits'),

    body('birthday')
        .notEmpty().withMessage('Birthday is required')
        .isDate().withMessage('Invalid birthday'),

    body('civil_status').notEmpty().withMessage('Civil status is required'),
    body('youth_age_gap').notEmpty().withMessage('Youth age gap is required'),
    body('youth_classification').notEmpty().withMessage('Youth classification is required'),
    body('educational_background').notEmpty().withMessage('Educational background is required'),
    body('work_status').notEmpty().withMessage('Work status is required'),

    body('registered_voter')
        .notEmpty().withMessage('Registered voter is required')
        .isIn(['yes', 'no']).withMessage('Value must be yes or no'),

    body('registered_national_voter')
        .notEmpty().withMessage('Registered national voter is required')
        .isIn(['yes', 'no']).withMessage('Value must be yes or no'),

    body('vote_last_election')
        .notEmpty().withMessage('Vote last election is required')
        .isIn(['yes', 'no']).withMessage('Value must be yes or no'),

    body('attended').isBoolean().withMessage('Attended must be true or false'),

    body('times_attended')
        .optional()
        .isInt({ min: 0 }).withMessage('Times attended must be a number'),

    body('reason_not_attend')
        .optional()
        .isString().withMessage('Reason not attend must be a string'),

    body('household')
        .notEmpty().withMessage('Household is required')
        .isString().withMessage('Household must be a string'),
];
