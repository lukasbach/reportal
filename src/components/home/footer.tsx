import React, { FC } from "react";
import { Box, Link } from "@primer/react";

export const Footer: FC = () => {
  return (
    <Box maxWidth="1200px" mx="auto" px="40px" mt={80} pt={5} pb={5} borderTop="1px solid" borderColor="border.default">
      Created by{" "}
      <Link href="https://lukasbach.com" target="blank">
        Lukas Bach
      </Link>
      . This project is not affiliated with GitHub.{" "}
      <Link href="https://github.com/lukasbach/reportal" target="blank">
        Star this project on Github
      </Link>
    </Box>
  );
};
