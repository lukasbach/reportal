import React, { FC } from "react";
import { Box, Spinner } from "@primer/react";
import { PageHeader } from "../components/common/page-header";
import { useProvisioning } from "./use-provisioning";

export const ProvisionPage: FC = () => {
  const dialog = useProvisioning();
  return (
    <Box p={4} maxWidth="800px">
      <PageHeader title="Provisioning user profile..." icon={<Spinner size="small" />} />
      <Box as="p">Please wait while we are getting things ready for you...</Box>
      {dialog}
    </Box>
  );
};
