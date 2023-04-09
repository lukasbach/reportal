export const isNotNullish = <T>(value: T | null | undefined): value is T => value !== undefined && value !== null;

export const resolveRecursiveSubitem = (structure: any, key: string) => {
  const parts = key.split(".");
  let current = structure;
  for (const part of parts) {
    current = current[part];
  }
  return current;
};
