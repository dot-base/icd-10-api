import * as r4Codesystem from "../model/icd10gmCodesystem";
import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { Filter } from "./filter";

export class TextFilter extends Filter {
    private static query: Fuse.Expression[] = [];
    private static keys: Fuse.FuseOptionKeyObject[] = [
        { name: "display", weight: 0.6 },
        { name: "property.valueString", weight: 0.4 },
    ];

    static search(searchTerms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
        let res: Fuse.FuseResult<ICodeSystem_Concept>[] = [];
        let termCount = searchTerms.length;
        const termCombs: string[][] = TextFilter.getTermCombinations(searchTerms);

        while (res.length < 1 && termCount > 0) {
            const termsByLength: string[][] = termCombs.filter((terms) => terms.length == termCount);
            TextFilter.setMultipleTermQuery(termsByLength);
            res = Filter.doSearch(TextFilter.keys, TextFilter.query);
            termCount--;
        }
        return res;
    }

    static getTermCombinations(terms: string[]): string[][] {
        if (terms.length === 1) return [terms];
        else {
            const subarr: string[][] = TextFilter.getTermCombinations(terms.slice(1));
            return subarr.concat(
                subarr.map((e) => e.concat([terms[0]])),
                [[terms[0]]]
            );
        }
    }

    static setQuery(queryStr: string[]) {
        queryStr.forEach((str) => TextFilter.query.push({ display: str }, { "property.valueString": str }));
    }

    static setMultipleTermQuery(searchTerms: string[][]) {
        const queryStr: string[] = [];
        searchTerms.forEach((term) => {
            queryStr.push(Filter.getQueryStringFuzzyMatchAND(term));
        });
        TextFilter.setQuery(queryStr);
    }
}
