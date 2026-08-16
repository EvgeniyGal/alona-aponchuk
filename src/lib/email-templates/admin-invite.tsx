import * as React from "react";
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

export interface AdminInviteProps {
  inviteUrl?: string;
  email?: string;
}

const Email = ({ inviteUrl, email }: AdminInviteProps) => (
  <Html lang="en">
    <Head />
    <Preview>You have been invited to the Aponchuk admin panel</Preview>
    <Body style={{ backgroundColor: "#f4f1ea", fontFamily: "Inter, Arial, sans-serif", padding: "32px 0" }}>
      <Container style={{ backgroundColor: "#ffffff", maxWidth: "560px", margin: "0 auto", padding: "32px", borderRadius: "10px" }}>
        <Heading style={{ fontSize: "22px", color: "#1f2933" }}>Admin invitation</Heading>
        <Text style={{ color: "#1f2933", fontSize: "14px", lineHeight: "1.6" }}>
          {email ? `${email} has` : "You have"} been invited to the Aponchuk Workflow Systems admin panel. Set your
          password using the link below. The link expires in 48 hours.
        </Text>
        {inviteUrl ? (
          <Section style={{ margin: "24px 0" }}>
            <Link
              href={inviteUrl}
              style={{
                backgroundColor: "#466a86",
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Set password
            </Link>
          </Section>
        ) : null}
        <Text style={{ color: "#5a6472", fontSize: "12px" }}>If you did not expect this email, you can ignore it.</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Set your Aponchuk admin password",
  displayName: "Admin Invite",
} satisfies TemplateEntry;
