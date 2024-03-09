import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import * as React from "react";

const body = {
  // backgroundColor: "#f3f4f6",
  backgroundColor: "#fff",
};

type Props = {
  workspaceName: string;
  link?: string;
};

export default function WorkspaceInviteEmailTemplate({
  workspaceName = "Marketing team",
  link = "http://localhost:3000/api/auth/callback/email?callbackUrl=http%3A%2F%2Flocalhost%3A3000&token=3862779cce10af2342b11eb5d5957ceb6797645a41c329c5200f31c2b741a32d&email=jalenparham97%40gmail.com",
}: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto p-1 font-sans" style={body}>
          <Container className="mx-auto my-[40px] rounded-lg border border-solid border-gray-200 bg-white px-10 py-5">
            {/* <Section className="mt-[32px]">
              <Img
                src={`${baseUrl}/static/logo.svg`}
                width="40"
                height="37"
                alt="Vercel"
                className="mx-auto my-0"
              />
            </Section> */}
            <Heading className="mx-0 mb-[30px] p-0 text-3xl font-bold text-black">
              Formbox
            </Heading>
            <Text className="text-2xl text-black">
              You&apos;ve been invited!
            </Text>
            <Text className="text-base text-black">
              You&apos;ve been invited to join the{" "}
              <span style={{ fontWeight: 600 }}>{workspaceName}</span> workspace
              on Formbox!
            </Text>
            <Text className="text-base text-black">
              You can use the button below to sign in to Formbox and join the
              workspace.
            </Text>
            <Section className="mb-[32px] mt-[32px]">
              <Button
                className="rounded-lg bg-[#000000] px-5 py-3 text-base font-semibold text-white no-underline"
                href={link}
              >
                Join workspace
              </Button>
            </Section>
            <Text className="text-base text-black">
              Or copy and paste this URL into a new tab of your browser:
            </Text>
            <Text className="text-sm text-black">
              <Link href={link} className="text-blue-600 no-underline">
                {link}
              </Link>
            </Text>
            <Text className="text-base text-black">
              If you did not request this email, you can safely ignore it.
            </Text>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
            <Text className="text-sm text-black">
              © {new Date().getFullYear()} Formbox · MI, USA
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
