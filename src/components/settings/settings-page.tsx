import React, { FC, ReactNode, useRef } from "react";
import { Box, Button, FormControl, Heading, Spinner, TextInput, Text, Flash } from "@primer/react";
import { GearIcon } from "@primer/octicons-react";
import { PageHeader } from "../common/page-header";
import { useExport } from "./use-export";
import { useImportFlow } from "./use-import-flow";
import { useClearDataFlow } from "./use-clear-data-flow";
import { ThemeSelector } from "./theme-selector";
import { useDeleteUserFlow } from "./use-delete-user-flow";

export const SettingsPage: FC = () => {
  const exportData = useExport();
  const { clearDataFlow, clearDialogs, isClearing } = useClearDataFlow();
  const { deleteDialogs, isDeleting, deleteUserFlow } = useDeleteUserFlow();
  const { fileInput, handleImport, importDialogs, isImporting } = useImportFlow();

  return (
    <Box p={4}>
      {importDialogs}
      {clearDialogs}
      {deleteDialogs}
      <PageHeader title="Settings" subtitle="Settings regarding your user." icon={<GearIcon size={16} />} />

      <Heading as="h2" sx={{ fontSize: 4, mt: 4 }}>
        Color Theme
      </Heading>
      <ThemeSelector>
        <Button>Change Theme</Button>
      </ThemeSelector>

      <Heading as="h2" sx={{ fontSize: 4, mt: 4 }}>
        Export Data
      </Heading>
      <Text as="p">
        Export all your data, i.e. your dashboard configurations and filter list queries, as JSON file. You can later
        import that data again.
      </Text>
      <Button onClick={exportData}>Export all my data</Button>

      <Heading as="h2" sx={{ fontSize: 4, mt: 4 }}>
        Import Data
      </Heading>
      <Text as="p">
        Import data from a JSON file that you or someone else previously exported. Note that this will not clear your
        data, but add the dashboards and lists from the file to your existing data. Clear your data below if you want to
        replace all your data with the data from the file.
      </Text>
      <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput type="file" ref={fileInput} sx={{ padding: "4px" }} />
      </FormControl>
      <Box display="flex" alignItems="center" mt={2}>
        <Button onClick={handleImport} sx={{ mr: 2 }}>
          Import data from export file
        </Button>
        {isImporting && <Spinner size="small" />}
      </Box>

      <Heading as="h2" sx={{ fontSize: 4, mt: 4 }}>
        Clear Data
      </Heading>
      <Flash variant="danger">
        <Text as="p" mt={0}>
          Remove all your data. This will not delete your account, but remove all your dashboard configurations and
          filter list queries. This cannot be undone. Export your data first if you want to keep it.
        </Text>
        <Box display="flex" alignItems="center">
          <Button onClick={clearDataFlow} sx={{ mr: 2 }} variant="danger">
            Clear all my data
          </Button>
          {isClearing && <Spinner size="small" />}
        </Box>
      </Flash>

      <Heading as="h2" sx={{ fontSize: 4, mt: 4 }}>
        Delete your account
      </Heading>
      <Flash variant="danger">
        <Text as="p" mt={0}>
          Remove all your data and delete your account.This will remove all your dashboard configurations and filter
          list queries. This cannot be undone. Export your data first if you want to keep it.
        </Text>
        <Box display="flex" alignItems="center">
          <Button onClick={deleteUserFlow} sx={{ mr: 2 }} variant="danger">
            Delete my account
          </Button>
          {isDeleting && <Spinner size="small" />}
        </Box>
      </Flash>
    </Box>
  );
};
