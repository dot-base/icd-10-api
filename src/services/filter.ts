import * as r4Codesystem from "../model/ICD10gmCodesystem";
import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";

export abstract class Filter {

  static search(terms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] { return [] };
  static setQuery(queryStr: string[] | string) { };

  static getQueryStringFuzzyMatchAND(searchTerms: string[]): string {
    let queryStr = "";
    searchTerms.forEach((term) => {
      queryStr += term + " ";
    });
    return queryStr;
  }

  static getQueryStringExactMatchOR(searchTerms: string[]): string {
    let queryStr = "=";
    searchTerms.forEach((term) => {
      queryStr += term + " | ";
    });
    return queryStr;
  }

  static doSearch(
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

  // different options for text or code useful?
  static getFuseOptions(keys: Fuse.FuseOptionKeyObject[]): Fuse.IFuseOptions<ICodeSystem_Concept> {
    return {
      isCaseSensitive: false, //default false
      shouldSort: true, //default true
      includeScore: true,
      includeMatches: true,
      findAllMatches: false, //perfect match in includes, later in display
      minMatchCharLength: 3, //default 1
      useExtendedSearch: true,
      ignoreFieldNorm: false, //if false: the shorter the field, the higher its relevance
      ignoreLocation: true,
      threshold: 0.3, //0: perfect match, 1: matches everything
      keys: keys,
    };
  }
}
