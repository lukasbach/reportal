import React, { FC } from "react";
import { Button, Heading } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChevronLeftIcon, PersonFillIcon, PersonIcon, RelFilePathIcon } from "@primer/octicons-react";
import { HomeContainer } from "./home-container";
import { NarrowContainer } from "./narrow-container";
import { SignInOption } from "./sign-in-option";
import { useLogin } from "../../auth/hooks";

export const LoginPage: FC = () => {
  const { signIn } = useLogin();
  return (
    <HomeContainer>
      <NarrowContainer>
        <Box mt={80} mb={60}>
          <Heading>Sign in</Heading>
        </Box>
        <SignInOption
          title="Normal Login"
          description={
            'Login through GitHub, and give reportal "repo" and "user" read access. You can see private repos in reportal.'
          }
          icon={<PersonFillIcon size={24} />}
          onClick={() => signIn(["repo", "user"])}
        />
        <SignInOption
          title="Login with minimal capabilities"
          description={
            "Login through GitHub, and don't give reportal any capabilities. You can only see public repos in reportal."
          }
          icon={<PersonIcon size={24} />}
          onClick={() => signIn([])}
        />
        <SignInOption
          title="Login with custom token"
          description="Use a Github personal access token to login. You customize the capabilities of the token yourself. What you see in reportal depends on how you configured the token."
          icon={<RelFilePathIcon size={24} />}
        />
        <Box>
          <Button hasArrow={false} leadingVisual={<ChevronLeftIcon />} as="a" href="#/">
            Back
          </Button>
        </Box>
      </NarrowContainer>
    </HomeContainer>
  );
};
