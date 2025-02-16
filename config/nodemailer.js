import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.js";

export const accountEmail = 'sameerselokar9823@gmail.com';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'sameerselokar9823@gmail.com',
        pass: EMAIL_PASSWORD
    }
})

export default transporter