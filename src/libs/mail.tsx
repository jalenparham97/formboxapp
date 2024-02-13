import SignInEmailTemplate from "@/emails/signin-email";
import { env } from "@/env";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

const emailFrom = `Formbox <${env.EMAIL_FROM}>`;

export async function sendMagicLink(email: string, link: string) {
  try {
    await resend.emails.send({
      subject: "Sign in to Formbox",
      from: emailFrom,
      to: email,
      react: <SignInEmailTemplate email={email} link={link} />,
    });
  } catch (error) {
    console.log(error);
  }
}
