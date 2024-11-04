import { FuseResult } from "fuse.js";
import { ICodeSystem_Concept, ICodeableConcept } from "@ahryman40k/ts-fhir-types/lib/R4";
import CodeFilter from "@/services/codeFilter";
import TextFilter from "@/services/textFilter";
import HTTPError from "@/utils/HTTPError";
import ICD10gm from "@/model/icd10CodeSystem";

export class ICD10Controller {
  private static icd10Regex = new RegExp("[A-TV-Z][0-9][0-9].?[0-9A-TV-Z]{0,4}", "i");
  private static stripRegex = new RegExp("[ -]+");

  public static getFiltered(searchstring: string): FuseResult<ICodeableConcept>[] {
    const searchTerms: string[] = ICD10Controller.splitTerms(searchstring);
    const icd10Codes: string[] = ICD10Controller.filterCodes(searchTerms);

    /**
     * If a query contains icd10 codes (e.g.  G20.9),
     * only codes are considered and remaining search terms are ignored
     */
    if (icd10Codes.length > 0) {
      const codeResponse = CodeFilter.initSearch(icd10Codes);
      if (codeResponse.length > 0) return codeResponse;
    }

    if (searchTerms.length > Number(process.env.MAX_SEARCH_WORDS))
      throw new HTTPError(
        `Search query exceeded max. amount of ${process.env.MAX_SEARCH_WORDS} allowed terms.`,
        400,
      );

    const searchResult = TextFilter.initSearch(searchTerms);
    return ICD10Controller.parseResultsToCodeableConcept(searchResult);
  }

  private static isICD10Code(str: string): boolean {
    return ICD10Controller.icd10Regex.test(str);
  }

  private static filterCodes(terms: string[]): string[] {
    return terms.filter((term) => ICD10Controller.isICD10Code(term));
  }

  private static splitTerms(str: string): string[] {
    return str.split(ICD10Controller.stripRegex);
  }

  private static parseResultsToCodeableConcept(
    results: FuseResult<ICodeSystem_Concept>[],
  ): FuseResult<ICodeableConcept>[] {
    const res: FuseResult<ICodeableConcept>[] = [];
    results.forEach((r) => {
      res.push(ICD10Controller.toCodeableConcept(r));
    });

    return res;
  }

  private static toCodeableConcept(
    r: FuseResult<ICodeSystem_Concept>,
  ): FuseResult<ICodeableConcept> {
    return {
      item: {
        coding: [
          {
            code: r.item.code,
            display: r.item.display,
            system: ICD10gm.system,
            version: ICD10gm.version,
          },
        ],
        text: r.item.definition,
      },
      score: r.score,
      matches: r.matches,
      refIndex: r.refIndex,
    };
  }
}
