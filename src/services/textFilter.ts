import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { Filter } from "./filter";

class TextFilter extends Filter {
  query: Fuse.Expression[] = [];
  keys: Fuse.FuseOptionKeyObject[] = [
        { name: "display", weight: 0.6 },
        { name: "property.valueString", weight: 0.4 },
    ];

  search(searchTerms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
    let res: Fuse.FuseResult<ICodeSystem_Concept>[] = [];
    let termCount = searchTerms.length;
    const termCombs: string[][] = this.getCombinations(searchTerms);
    while (res.length < 1 && termCount > 0) {
      const termsByLength: string[][] = termCombs.filter((terms) => terms.length == termCount);
      this.setMultipleTermsQuery(termsByLength);
      res = this.doSearch(this.keys, this.query);
      termCount--;
    }
    return res;
  }

  private getCombinations(terms: string[]): string[][] {
    if (terms.length === 1) return [terms];
    else {
      const subarr: string[][] = this.getCombinations(terms.slice(1));
      return subarr.concat(
        subarr.map((e) => e.concat([terms[0]])),
        [[terms[0]]]
      );
    }
  }

  setQuery(queryStr: string[]): void {
        queryStr.forEach((str) => TextFilter.query.push({ display: str }, { "property.valueString": str }));
    }

  private setMultipleTermsQuery(searchTerms: string[][]): void {
    const queryStr: string[] = [];
    };
        searchTerms.forEach((term) => {
            queryStr.push(Filter.getQueryStringFuzzyMatchAND(term));
        });
    this.setQuery(queryStr);
  }
}

export const initSearch = (terms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] => {
  const textFilter = new TextFilter();
  return textFilter.search(terms);
};
