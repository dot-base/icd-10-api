import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { Filter } from "./filter";

class CodeFilter extends Filter {
  query: Fuse.Expression[] = [];
  keys: Fuse.FuseOptionKeyObject[] = [{ name: "code", weight: 1 }];

  search(icdCodes: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
        const queryStr: string = Filter.getQueryStringExactMatchOR(icdCodes);
        CodeFilter.setQuery(queryStr);
        const res: Fuse.FuseResult<ICodeSystem_Concept>[] = Filter.doSearch(CodeFilter.keys, CodeFilter.query);
    this.setQuery(queryStr);
    const res: Fuse.FuseResult<ICodeSystem_Concept>[] = this.doSearch(this.keys, this.query);
    return res;
  }

    static setQuery(queryStr: string) {
        CodeFilter.query.push({ code: queryStr });

    }
}

export const initSearch = (codes: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] => {
  const codeFilter = new CodeFilter();
  return codeFilter.search(codes);
};
