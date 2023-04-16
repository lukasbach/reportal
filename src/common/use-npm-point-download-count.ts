import { useQuery } from "@tanstack/react-query";

export const useNpmPointDownloadCount = (packageName: string, range: string) => {
  return useQuery(["npm-point-download-count", packageName, range], () => {
    return fetch(`https://api.npmjs.org/downloads/point/${range}/${packageName}`).then(
      (response) => response.json() as Promise<{ downloads: number }>
    );
  });
};
