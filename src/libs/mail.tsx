import { env } from "@/env";
import { Resend } from "resend";
import type { Answer } from "@prisma/client";
import OrgInviteEmailTemplate from "@/emails/org-invite-email-template";
import SignInEmailTemplate from "@/emails/signin-email";
import WorkspaceInviteEmailTemplate from "@/emails/workspace-invite-email-template";

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

type SubmissionNotificationEmailPayload = {
  to: string;
  subject: string;
  react: JSX.Element;
};

export async function sendBatchSubmissionNotificationEmail(
  payload: SubmissionNotificationEmailPayload[],
) {
  const emails = payload.map((email) => {
    return {
      ...email,
      from: emailFrom,
    };
  });
  return await resend.batch.send(emails);
}

export async function sendFormRespondentEmail(
  fromName: string,
  to: string,
  subject: string,
  html: string,
) {
  return await resend.emails.send({
    from: `${fromName} <${env.EMAIL_FROM}>`,
    subject,
    to,
    html,
  });
}

function injectTemplateValues(answers: Answer[], html: string) {
  let newHtml = html;
  answers.forEach((answer) => {
    newHtml = newHtml.replace(`{{${answer.label}}}`, answer.value);
  });
  return newHtml;
}
