import { OrgInviteEmailTemplate } from "@/emails/org-invite-email-template";
import { SignInEmailTemplate } from "@/emails/signin-email";
import { WorkspaceInviteEmailTemplate } from "@/emails/workspace-invite-email-template";
import { env } from "@/env";
import { Resend } from "resend";

export const resend = new Resend(env.RESEND_API_KEY);

const emailFrom = `Formbox <${env.EMAIL_FROM}>`;

export async function sendMagicLink(email: string, link: string) {
  return await resend.emails.send({
    subject: "Sign in to Formbox",
    from: emailFrom,
    to: email,
    react: <SignInEmailTemplate email={email} link={link} />,
  });
}

export async function sendWorkspaceInviteEmail(
  email: string,
  workspaceName: string,
  link: string,
) {
  return await resend.emails.send({
    subject: "You've been invited to join a workspace on Formbox",
    from: emailFrom,
    to: email,
    react: (
      <WorkspaceInviteEmailTemplate workspaceName={workspaceName} link={link} />
    ),
  });
}

export async function sendOrgInviteEmail(
  email: string,
  orgName: string,
  link: string,
) {
  return await resend.emails.send({
    subject: "You've been invited to join an organization on Formbox",
    from: emailFrom,
    to: email,
    react: <OrgInviteEmailTemplate orgName={orgName} link={link} />,
  });
}
