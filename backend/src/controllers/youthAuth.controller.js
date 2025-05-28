import { pool } from '../db/config.js';
import { validationResult } from 'express-validator'
import { hashPassword, createToken } from '../lib/index.js'

export const signup = () => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({
        errors: errors.array()
    });

    try {
        const {
            username,
            password,
            first_name,
            middle_name,
            last_name,
            suffix,
            region,
            province,
            municipality,
            barangay,
            purok,
            gender,
            age,
            contact,
            email,
            birthday,
            civil_status,
            youth_age_gap,
            youth_classification,
            educational_background,
            work_status,
            registered_voter,
            registered_national_voter,
            vote_last_election,
            attended,
            times_attended,
            reason_not_attend
        } = req.body;

        if (!) {
            
        }

    } catch (error) {

    }



}