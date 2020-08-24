import ICD10gm from "../model/ICD10gmCodesystem";
import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { QueryOptions } from "@/types/queryOptions";

export class FuseSearch {
  protected static getQueryString(searchTerms: string[], queryOptions: QueryOptions): string {
    let queryStr = queryOptions.matchType + searchTerms[0];
    if (searchTerms.length > 1)
      for (const term of searchTerms) queryStr += queryOptions.logicalOperator + term;
    return queryStr;
  }

  protected static doSearch(
    keys: Fuse.FuseOptionKeyObject[],
    query: Fuse.Expression[]
  ): Fuse.FuseResult<ICodeSystem_Concept>[] {
    const icd10 = ICD10gm.getInstance();
    const base = icd10.processedCodesystem?.concept ? icd10.processedCodesystem.concept : [];
    const options = FuseSearch.getOptions(keys);
    const index = Fuse.createIndex(keys, base);
    const fuse = new Fuse(base, options, index);
    return fuse.search({ $or: query });
  }

  private static getOptions(
    keys: Fuse.FuseOptionKeyObject[]
  ): Fuse.IFuseOptions<ICodeSystem_Concept> {
    return {
      includeScore: true,
      includeMatches: true,
      findAllMatches: true,
      minMatchCharLength: 3, //default 1
      useExtendedSearch: true,
      ignoreFieldNorm: false, //if false: the shorter the field, the higher its relevance
      ignoreLocation: true,
      threshold: 0.3, //0: perfect match, 1: matches everything
      keys: keys,
    };
  }
}
