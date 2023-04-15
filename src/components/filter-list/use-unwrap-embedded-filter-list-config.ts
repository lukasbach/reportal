import { EmbeddedFilterListPayload } from "./types";
import { useFilterListData } from "../../firebase/filter-lists";

export const useUnwrapEmbeddedFilterListConfig = (embeddedData: EmbeddedFilterListPayload) => {
  const [filterList] = useFilterListData(embeddedData.type === "linked" ? embeddedData.id : null);
  const embeddedFilterList = embeddedData.type === "embedded" ? embeddedData : null;
  const data = embeddedFilterList?.state ?? filterList?.data()?.state;
  const id = filterList?.id;
  return { data, id };
};
