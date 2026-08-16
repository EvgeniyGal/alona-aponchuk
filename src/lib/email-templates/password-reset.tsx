import * as React from "react";
import { Body, Container, Head, Heading, Html, Link, Preview, Section, Text } from "@react-email/components";
import type { TemplateEntry } from "./registry";

export interface PasswordResetProps {
  resetUrl?: string;
}

const Email = ({ resetUrl }: PasswordResetProps) => (
  <Html lang="en">
    <Head />
    <Preview>Reset your Aponchuk admin password</Preview>
    <Body style={{ backgroundColor: "#f4f1ea", fontFamily: "Inter, Arial, sans-serif", padding: "32px 0" }}>
      <Container style={{ backgroundColor: "#ffffff", maxWidth: "560px", margin: "0 auto", padding: "32px", borderRadius: "10px" }}>
        <Heading style={{ fontSize: "22px", color: "#1f2933" }}>Password reset</Heading>
        <Text style={{ color: "#1f2933", fontSize: "14px", lineHeight: "1.6" }}>
          We received a request to reset your admin password. This link expires in 1 hour.
        </Text>
        {resetUrl ? (
          <Section style={{ margin: "24px 0" }}>
            <Link
              href={resetUrl}
              style={{
                backgroundColor: "#466a86",
                color: "#ffffff",
                padding: "12px 18px",
                borderRadius: "6px",
                textDecoration: "none",
                fontSize: "14px",
              }}
            >
              Reset password
            </Link>
          </Section>
        ) : null}
        <Text style={{ color: "#5a6472", fontSize: "12px" }}>If you did not request this, you can ignore this email.</Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: Email,
  subject: "Reset your Aponchuk admin password",
  displayName: "Password Reset",
} satisfies TemplateEntry;
