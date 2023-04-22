import React, { FC, useState } from "react";
import { Button, Heading, FormControl, TextInput, UnorderedList } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChevronLeftIcon } from "@primer/octicons-react";
import { HomeContainer } from "./home-container";
import { NarrowContainer } from "./narrow-container";
import { useRedirectToAppIfLoggedIn, useTokenLogin } from "../../auth/hooks";

export const LoginViaTokenPage: FC = () => {
  const { signIn } = useTokenLogin();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  useRedirectToAppIfLoggedIn();
  return (
    <HomeContainer>
      <NarrowContainer>
        <Box mt={80} mb={60}>
          <Heading>Sign in</Heading>
        </Box>
        <Box my={4}>
          <FormControl fullWidth>
            <FormControl.Label>E-Mail Adress</FormControl.Label>
            <TextInput
              type="email"
              placeholder="mail@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
        </Box>
        <Box my={4}>
          <FormControl fullWidth>
            <FormControl.Label>GitHub Personal Access Token</FormControl.Label>
            <TextInput type="text" placeholder="Token" onChange={(e) => setToken(e.target.value)} value={token} />
          </FormControl>
        </Box>
        <Box mb={4}>
          <Heading as="h3">How it works</Heading>
          <UnorderedList>
            <UnorderedList.Item>
              Your email-adress is used to associate your data, i.e. your dashboard configurations, with your user
            </UnorderedList.Item>
            <UnorderedList.Item>
              You will receive e-mails with a authentication link every time you try to login. You will not need a
              password.
            </UnorderedList.Item>
            <UnorderedList.Item>You will never receive e-mails for any other purposes.</UnorderedList.Item>
            <UnorderedList.Item>
              You only need an e-mail for authentication if you logged out or try to sign in on a different device.
            </UnorderedList.Item>
            <UnorderedList.Item>
              Your GitHub token is only stored client-side, and not stored on our servers.
            </UnorderedList.Item>
            <UnorderedList.Item>
              If you logout, or try to login on a different device, you need to re-enter your token or create a new one.
            </UnorderedList.Item>
          </UnorderedList>
        </Box>
        <Box display="flex" sx={{ "> *": { mr: 4 } }}>
          <Button hasArrow={false} leadingVisual={<ChevronLeftIcon />} as="a" href="#/login">
            Back
          </Button>
          <Button hasArrow={false} as="a" href="https://github.com/settings/tokens" target="_blank">
            Create a Token on Github
          </Button>
          <Button variant="primary" onClick={() => signIn(email, token)}>
            Sign In
          </Button>
        </Box>
      </NarrowContainer>
    </HomeContainer>
  );
};
