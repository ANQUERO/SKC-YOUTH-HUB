import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for SMTP
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Send verification email
export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const transporter = createTransporter();

        const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        const mailOptions = {
            from: `"SK Youth Hub" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Verify Your Email - SK Youth Hub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">SK Youth Hub</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">Welcome to SK Youth Hub!</h2>
                        <p style="color: #666; line-height: 1.6;">
                            Thank you for registering with SK Youth Hub. To complete your registration and activate your account, 
                            please verify your email address by clicking the button below.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${verificationUrl}" 
                               style="background: #1976d2; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Verify Email Address
                            </a>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6; font-size: 14px;">
                            If the button doesn't work, you can also copy and paste this link into your browser:
                        </p>
                        <p style="color: #1976d2; word-break: break-all; font-size: 14px;">
                            ${verificationUrl}
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                This verification link will expire in 24 hours. If you didn't create an account with SK Youth Hub, 
                                please ignore this email.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Verification email sent:', result.messageId);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const transporter = createTransporter();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"SK Youth Hub" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Reset Your Password - SK Youth Hub',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 28px;">SK Youth Hub</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px;">Password Reset</p>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
                        <p style="color: #666; line-height: 1.6;">
                            You requested to reset your password for your SK Youth Hub account. 
                            Click the button below to create a new password.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" 
                               style="background: #d32f2f; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                                Reset Password
                            </a>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6; font-size: 14px;">
                            If the button doesn't work, you can also copy and paste this link into your browser:
                        </p>
                        <p style="color: #d32f2f; word-break: break-all; font-size: 14px;">
                            ${resetUrl}
                        </p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #999; font-size: 12px; margin: 0;">
                                This reset link will expire in 1 hour. If you didn't request a password reset, 
                                please ignore this email.
                            </p>
                        </div>
                    </div>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', result.messageId);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};
