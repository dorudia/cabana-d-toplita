import { Button, Container, Html, Text } from "@react-email/components";
import * as React from "react";

export default function Welcome({ name, email, password }) {
  return (
    <Html>
      <h1
        style={{
          color: "#fcf5ea",
          textAlign: "center",
          background: "#845203",
          padding: "24px 0px",
          letterSpacing: "1px",
        }}
      >
        Salut{" "}
        <Text
          style={{
            display: "inline",
            fontSize: "28px",
            textTransform: "capitalize",
            color: "#fff3da",
          }}
        >
          {name}
        </Text>{" "}
        , Welcome to Cabana D Toplita
      </h1>
      {/* <Button
        href="https://example.com"
        style={{
          background: "#845203",
          color: "#fffcba",
          padding: "12px 20px",
        }}
      >
        Click me
      </Button> */}
      <Container style={{ background: "#fcf5ea", padding: "24px 0px" }}>
        <Text
          style={{
            color: "#845203",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Welcome to Cabana D Toplita!
        </Text>
        <Text
          style={{
            color: "#845203",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          We're thrilled to have you join our community! Your account has been
          successfully created.
        </Text>
        <Text
          style={{
            color: "#845203",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        ></Text>
        <Text
          style={{
            color: "#845203",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          To get started, you can log in to your account using the following
          credentials:
        </Text>
        <Text
          style={{
            color: "#845203",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Email: {email}
        </Text>
        <Text
          style={{
            color: "#845203",
            textAlign: "center",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          Password: {password}
        </Text>
      </Container>
    </Html>
  );
}
