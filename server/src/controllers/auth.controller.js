// Import sa mga dependencies (mga library nga gamiton)
import supabse from '../db/config.js';
import { validationResult } from 'express-validator'
import { hashPassword, createToken, comparePassword } from '../lib/index.js'


//Signup
export const signup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

    const {
        username, password, first_name, middle_name, last_name, suffix,
        region, province, municipality, barangay, purok,
        gender, age, contact, email, birthday,
        civil_status, youth_age_gap, youth_classification,
        educational_background, work_status,
        registered_voter, registered_national_voter, vote_last_election,
        attended, times_attended, reason_not_attend, household
    } = req.body;

    try {
        const { data: existingUser } = await supabase
            .from('sk_youth')
            .select('youth_id')
            .eq('username', username)
            .maybeSingle();

        if (existingUser)
            return res.status(409).json({ status: "failed", message: "Username already exists" });

        const { data: existingEmail } = await supabase
            .from('sk_youth_info')
            .select('youth_id')
            .eq('email', email)
            .maybeSingle();

        if (existingEmail)
            return res.status(409).json({ status: "failed", message: "Email already exists" });

        const allowedGender = ["male", "female"];
        if (!allowedGender.includes(gender.toLowerCase()))
            return res.status(409).json({
                status: "failed",
                message: `Invalid gender. Allowed values are: ${allowedGender.join(", ")}.`
            });

        if (age < 16 || age > 30)
            return res.status(409).json({
                status: "failed",
                message: `Invalid age. Allowed age must be between 16 and 30`
            });

        const yesNo = ["yes", "no"];
        const yesNoFields = {
            registered_voter,
            registered_national_voter,
            vote_last_election
        };

        for (const [key, value] of Object.entries(yesNoFields)) {
            if (!yesNo.includes(value.toLowerCase()))
                return res.status(409).json({
                    status: "failed",
                    message: `Invalid value for ${key}. Must be 'yes' or 'no'.`
                });
        }

        const hashedPassword = await hashPassword(password);

        // Insert into sk_youth
        const { data: userInsert, error: userError } = await supabase
            .from('sk_youth')
            .insert({ username, password: hashedPassword })
            .select('youth_id')
            .maybeSingle();

        if (userError) throw userError;

        const youthId = userInsert.youth_id;

        // Batch insert data to other tables
        const insertTasks = [
            supabase.from('sk_youth_name').insert({ youth_id: youthId, first_name, middle_name, last_name, suffix }),
            supabase.from('sk_youth_location').insert({ youth_id: youthId, region, province, municipality, barangay, purok }),
            supabase.from('sk_youth_gender').insert({ youth_id: youthId, gender: gender.toLowerCase() }),
            supabase.from('sk_youth_info').insert({ youth_id: youthId, age, contact, email, birthday }),
            supabase.from('sk_youth_demographics').insert({
                youth_id: youthId,
                civil_status, youth_age_gap, youth_classification,
                educational_background, work_status
            }),
            supabase.from('sk_youth_survey').insert({
                youth_id: youthId, registered_voter, registered_national_voter, vote_last_election
            }),
            supabase.from('sk_youth_meeting_survey').insert({
                youth_id: youthId, attended, times_attended, reason_not_attend
            }),
            supabase.from('sk_youth_household').insert({ youth_id: youthId, household })
        ];

        for (const task of insertTasks) {
            const { error } = await task;
            if (error) throw error;
        }

        const token = createToken({ id: youthId, type: 'youth' });

        res.status(200).json({
            status: "Success",
            message: "User signed up successfully",
            token,
            youth_id: youthId
        });

    } catch (error) {
        console.error("Signup error", error);
        res.status(500).json({
            status: "failed",
            message: "Server error during signup",
            error: error.message
        });
    }
};

//Signin
export const signin = async (req, res) => {
    const { usernameOrEmail, password, account_type } = req.body;

    if (!usernameOrEmail || !password || !account_type) {
        return res.status(400).json({
            status: "failed",
            message: "Please provide username/email, password and account_type"
        });
    }

    try {
        let user, isMatch, token, userId, userType;

        if (account_type === 'admin') {
            const { data: admin, error: adminErr } = await supabase
                .from('sk_official_admin')
                .select('*')
                .eq('email', usernameOrEmail)
                .maybeSingle();

            if (adminErr) throw adminErr;
            if (!admin)
                return res.status(401).json({ status: "failed", message: "Invalid email or username" });

            isMatch = await comparePassword(password, admin.password);
            if (!isMatch)
                return res.status(401).json({ status: "failed", message: "Invalid password" });

            token = createToken({ id: admin.admin_id, type: 'admin' });
            user = { ...admin };
            delete user.password;
            userId = admin.admin_id;
            userType = 'admin';

        } else if (account_type === 'youth') {
            const { data: youth, error: youthErr } = await supabase
                .from('sk_youth')
                .select('youth_id, username, password')
                .eq('username', usernameOrEmail)
                .maybeSingle();

            if (youthErr) throw youthErr;
            if (!youth)
                return res.status(401).json({ status: "failed", message: "Invalid Username or Password" });

            isMatch = await comparePassword(password, youth.password);
            if (!isMatch)
                return res.status(401).json({ status: "failed", message: "Invalid Username or Password" });

            token = createToken({ id: youth.youth_id, type: 'youth' });
            user = { ...youth };
            delete user.password;
            userId = youth.youth_id;
            userType = 'youth';

        } else {
            return res.status(400).json({
                status: "failed",
                message: "Invalid account type. Must be 'admin' or 'youth'."
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Signin successfully",
            token,
            userType,
            userId,
            user
        });

    } catch (error) {
        console.error("Signin error", error);
        res.status(500).json({
            status: "failed",
            message: "Server error during signin"
        });
    }
};

//Logout
export const logout = async (req, res) => {
    try {
        res.status(200).json({
            status: "Success",
            message: "Logged out successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Error",
            message: "Something went wrong during logout"
        });
    }
};