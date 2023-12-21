import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import Filter from "@/services/filter";
import { QueryOptions, MatchType, LogicalOperator } from "@/types/queryOptions";
import FuseSearch from "@/services/fuseSearch";
import { Expression, FuseOptionKeyObject, FuseResult } from "fuse.js";

export default class CodeFilter extends Filter {
  protected static keys: FuseOptionKeyObject<ICodeSystem_Concept>[] = [{ name: "code", weight: 1 }];

  protected static queryOptions: QueryOptions = {
    matchType: MatchType.exactMatch,
    logicalOperator: LogicalOperator.OR,
  };

  public static initSearch(icdCodes: string[]): FuseResult<ICodeSystem_Concept>[] {
    const queryStr: string = FuseSearch.getQueryString(icdCodes, CodeFilter.queryOptions);
    const query: Expression[] = CodeFilter.getQuery(queryStr);
    return FuseSearch.doSearch(CodeFilter.keys, query);
  }

  protected static getQuery(queryStr: string): Expression[] {
    return [{ code: queryStr }];
  }
}
