import { Container, Loader } from "@mantine/core";
import { useEffect } from "react";

export const StripeCheckout = ({ sessionId, sessionUrl }) => {
  useEffect(() => {
    const openStripeCheckout = () => {
      if (sessionUrl) {
        window.location.href = sessionUrl;
      }
    };
    openStripeCheckout();
  }, [sessionId, sessionUrl]);
  return (
    <Container>
      <Loader />;
    </Container>
  );
};
