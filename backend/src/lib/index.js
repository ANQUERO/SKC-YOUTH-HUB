import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const hashPassword = async (userValue) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userValue, salt);
    return hashedPassword;
};

export const comparePassword = async (adminPassword, password) => {
    try {
        const isMatch = await bcrypt.compare(adminPassword, password);
        return isMatch;
    } catch (error) {
        console.log(error)
    }
}

export const createToken = (id) => {
    return jwt.sign(
        {
            userId: id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d",
        },
    );
};