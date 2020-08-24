import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { Filter } from "./filter";
import { QueryOptions, MatchType, LogicalOperator } from "@/types/queryOptions";
import { FuseSearch } from "./fuseSearch";

export class TextFilter extends Filter {
  protected static keys: Fuse.FuseOptionKeyObject[] = [
    { name: "extension.valueString", weight: 0.6 },
    { name: "modifierExtension.valueString", weight: 0.4 },
  ];
  protected static queryOptions: QueryOptions = {
    matchType: MatchType.fuzzy,
    logicalOperator: LogicalOperator.AND,
  };

  public static initSearch(searchTerms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
    let res: Fuse.FuseResult<ICodeSystem_Concept>[] = [];
    let termCount = searchTerms.length;
    const termCombs: string[][] = TextFilter.getCombinations(searchTerms);

    while (res.length < 1 && termCount > 0) {
      const termsByLength: string[][] = termCombs.filter((terms) => terms.length == termCount);
      const queryStr: string[] = TextFilter.getMultipleTermsQuery(termsByLength);
      const query: Fuse.Expression[] = TextFilter.getQuery(queryStr);
      res = FuseSearch.doSearch(TextFilter.keys, query);
      termCount--;
    }
    return res;
  }

  protected static getQuery(queryStr: string[]): Fuse.Expression[] {
    const query: Fuse.Expression[] = [];
    queryStr.forEach((str) =>
      query.push({ "extension.valueString": str }, { "modifierExtension.valueString": str })
    );
    return query;
  }

  private static getCombinations(terms: string[]): string[][] {
    if (terms.length === 1) return [terms];
    else {
      const subarr: string[][] = TextFilter.getCombinations(terms.slice(1));
      return subarr.concat(
        subarr.map((e) => e.concat([terms[0]])),
        [[terms[0]]]
      );
    }
  }

  private static getMultipleTermsQuery(searchTerms: string[][]): string[] {
    const queryStr: string[] = [];
    searchTerms.forEach((term) => {
      queryStr.push(FuseSearch.getQueryString(term, TextFilter.queryOptions));
    });
    return queryStr;
  }
}
