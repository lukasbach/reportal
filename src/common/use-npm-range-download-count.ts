import { useQuery } from "@tanstack/react-query";

export const useNpmRangeDownloadCount = (packageName: string, range: string) => {
  return useQuery(["npm-range-download-count", packageName, range], () => {
    return fetch(`https://api.npmjs.org/downloads/range/${range}/${packageName}`).then(
      (response) => response.json() as Promise<{ downloads: { downloads: number; day: string }[] }>
    );
  });
};
