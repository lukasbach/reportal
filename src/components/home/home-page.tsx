import React, { FC } from "react";
import { Box, Link } from "@primer/react";
import { Heading, Text, Hero, Button, ThemeProvider } from "@primer/react-brand";
import demo from "../../assets/demo-medium.gif";
import mySvg from "../../assets/bg.svg";
import dashboardImage from "../../assets/dashboard-example.png";
import repoListImage from "../../assets/repo-list-example.png";
import searchbarImage from "../../assets/searchbar-example.png";
import filterListImage from "../../assets/filter-lists-page.png";
import { CustomRiver } from "../common/custom-river";

export type HomePageProps = {};

export const HomePage: FC<HomePageProps> = () => {
  return (
    <ThemeProvider colorMode="dark">
      <Box
        style={{ backgroundImage: `url(${mySvg})`, backgroundRepeat: "no-repeat" }}
        minHeight="100%"
        bg="#080a0e"
        overflowX="hidden"
      >
        <Box maxWidth="1200px" mx="auto" px="40px">
          <Box sx={{ "> section": { pt: "60px !important", pb: "20px !important" } }}>
            <Hero
              heading="reportal"
              description="A dashboarding- and item management tool for Github."
              primaryAction={{
                text: "Get Started",
                href: "#",
              }}
              secondaryAction={{
                text: "Show on Github",
                href: "#",
              }}
              align="center"
            />
          </Box>
          <Box textAlign="center">
            <Box as="img" src={demo} maxWidth="calc(100% + 200px)" borderRadius="32px" />
          </Box>
          <Box textAlign="center" pt={40}>
            <Box as="p" mb={4} color="fg.muted">
              Reportal is not affiliated with GitHub, but is a free and standalone project. It integrates into the
              official GitHub API to provide dashboarding and item-management capabilities.
            </Box>
            <Button size="large" variant="primary">
              Sign in
            </Button>
          </Box>
        </Box>

        <CustomRiver img={dashboardImage} height="600px" invert>
          <Heading>Create custom Views</Heading>
          <Text>
            Arrange lists of issues or discussions, count the number of PRs or releases, or plot the number of stars or
            open issues.
          </Text>
        </CustomRiver>

        <CustomRiver img={repoListImage} height="600px">
          <Heading>Powerful List Views</Heading>
          <Text>
            Create custom lists of issues, discussions, repositories and more. Save lists as standalone views or widgets
            in dashboards, so that you always keep an overview of items you need.
          </Text>
        </CustomRiver>

        <CustomRiver img={searchbarImage} height="600px" invert>
          <Heading>Extended Search Queries</Heading>
          <Text>
            You can use GitHub&apos;s search syntax to create list queries. Additionally, you can use custom operators
            to use client-side filters that is not available in the official GitHub API.
          </Text>
        </CustomRiver>

        <CustomRiver img={filterListImage} height="600px">
          <Heading>Save Lists and Dashboards for later</Heading>
          <Text>Create as many list views and dashboards as you need.</Text>
        </CustomRiver>

        <Box
          maxWidth="1200px"
          mx="auto"
          px="40px"
          mt={80}
          pt={5}
          pb={5}
          borderTop="1px solid"
          borderColor="border.default"
        >
          Created by{" "}
          <Link href="https://lukasbach.com" target="blank">
            Lukas Bach
          </Link>
          . This project is not affiliated with GitHub.{" "}
          <Link href="https://github.com/lukasbach/reportal" target="blank">
            Star this project on Github
          </Link>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
