import * as r4Codesystem from "../model/ICD10gmCodesystem";
import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";

export abstract class Filter {
  abstract query: Fuse.Expression[];
  abstract keys: Fuse.FuseOptionKeyObject[];
  abstract search(terms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[];
  abstract setQuery(queryStr: string[] | string): void;

  getQueryString(searchTerms: string[], queryOptions: QueryOptions): string {
    let queryStr = queryOptions.matchType + searchTerms[0];

  static getQueryStringFuzzyMatchAND(searchTerms: string[]): string {
    let queryStr = "";
    searchTerms.forEach((term) => {
      queryStr += term + " ";
    });
    return queryStr;
  }

  doSearch(
    keys: Fuse.FuseOptionKeyObject[],
    query: Fuse.Expression[]
  ): Fuse.FuseResult<ICodeSystem_Concept>[] {
    const base = r4Codesystem.ICD10gm.codesystemPrefilteredText?.concept
      ? r4Codesystem.ICD10gm.codesystemPrefilteredText.concept
      : [];

    const options = Filter.getFuseOptions(keys);
    const index = Fuse.createIndex(keys, base);
    const fuse = new Fuse(base, options, index);
    const res: Fuse.FuseResult<ICodeSystem_Concept>[] = fuse.search({
      $or: query,
    });
    return res;
  }

  private static getFuseOptions(
    keys: Fuse.FuseOptionKeyObject[]
  ): Fuse.IFuseOptions<ICodeSystem_Concept> {
    return {
      includeScore: true,
      includeMatches: true,
      findAllMatches: true, //perfect match in includes, later in display
      minMatchCharLength: 3, //default 1
      useExtendedSearch: true,
      ignoreFieldNorm: false, //if false: the shorter the field, the higher its relevance
      ignoreLocation: true,
      threshold: 0.3, //0: perfect match, 1: matches everything
      keys: keys,
    };
  }
}
