import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASS,
    },
});

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: [process.env.APP_URL!],
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "User",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                required: false
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp : true,
        autoSignInAfterVerification : true,
        sendVerificationEmail: async ({ user, url, token }, request) => {
            try {
                const verificationEmail = `${process.env.APP_URL}/verify-email?token=${token}`;
                const info = await transporter.sendMail({
                    from: '"Prisma Blog" <prismablog@gmail.com>',
                    to: user.email,
                    subject: "Please verify your email",
                    text: `Hello ${user.name}`, // Plain-text version of the message
                    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:20px;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:#4f46e5; padding:20px; text-align:center; color:#ffffff; font-size:24px; font-weight:bold;">
              Prisma Blog
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <h2 style="margin-top:0;">Verify Your Email</h2>
              <p style="font-size:16px; line-height:1.5;">
                Thanks for signing up! Please confirm your email address by clicking the button below.
              </p>

              <!-- Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${verificationEmail}" 
                   style="background:#4f46e5; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-size:16px; display:inline-block;">
                   Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#666;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>

              <p style="word-break:break-all; font-size:14px; color:#4f46e5;">
                ${verificationEmail}
              </p>

              <p style="font-size:14px; color:#999; margin-top:30px;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#888;">
              © ${new Date().getFullYear()} Prisma Blog. All rights reserved.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
                });

                console.log("Message sent:", info.messageId);
            } catch (err) {
                console.error(err)
                throw err;
            }
        },
    },
});