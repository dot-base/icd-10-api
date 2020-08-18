import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { Filter } from "./filter";
import { QueryOptions, MatchType, LogicalOperator } from "@/types/queryOptions";

class CodeFilter extends Filter {
  query: Fuse.Expression[] = [];
  keys: Fuse.FuseOptionKeyObject[] = [{ name: "code", weight: 1 }];

  search(icdCodes: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
    const queryOptions: QueryOptions = {
      matchType: MatchType.exactMatch,
      logicalOperator: LogicalOperator.OR,
    };
    const queryStr: string = this.getQueryString(icdCodes, queryOptions);
    this.setQuery(queryStr);
    const res: Fuse.FuseResult<ICodeSystem_Concept>[] = this.doSearch(this.keys, this.query);
    return res;
  }

  setQuery(queryStr: string): void {
    this.query.push({ code: queryStr });
  }
}

export const initSearch = (codes: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] => {
  const codeFilter = new CodeFilter();
  return codeFilter.search(codes);
};
