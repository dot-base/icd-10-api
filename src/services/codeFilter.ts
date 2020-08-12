import * as r4Codesystem from "../model/ICD10gmCodesystem";
import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { Filter } from "./filter";

export class CodeFilter extends Filter {
    private static query: Fuse.Expression[] = [];
    private static keys: Fuse.FuseOptionKeyObject[] = [{ name: "code", weight: 1 }];

    static search(icdCodes: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
        const queryStr: string = Filter.getQueryStringExactMatchOR(icdCodes);
        CodeFilter.setQuery(queryStr);
        const res: Fuse.FuseResult<ICodeSystem_Concept>[] = Filter.doSearch(CodeFilter.keys, CodeFilter.query);
        return res;
    }

    static setQuery(queryStr: string) {
        CodeFilter.query.push({ code: queryStr });

    }
}
