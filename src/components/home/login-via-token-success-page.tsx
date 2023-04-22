import React, { FC } from "react";
import { Button, Heading } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChevronLeftIcon } from "@primer/octicons-react";
import { HomeContainer } from "./home-container";
import { NarrowContainer } from "./narrow-container";
import { useRedirectToAppIfLoggedIn } from "../../auth/hooks";

export const LoginViaTokenSuccessPage: FC = () => {
  useRedirectToAppIfLoggedIn();
  return (
    <HomeContainer>
      <NarrowContainer>
        <Box mt={80} mb={60}>
          <Heading>Sign in</Heading>
        </Box>
        <Box as="p" mb={4}>
          A sign-in email has been sent to your email address. Please click the link in the email to complete the
          sign-in process.
        </Box>
        <Box display="flex" sx={{ "> *": { mr: 4 } }}>
          <Button hasArrow={false} leadingVisual={<ChevronLeftIcon />} as="a" href="#/login">
            Back
          </Button>
        </Box>
      </NarrowContainer>
    </HomeContainer>
  );
};
