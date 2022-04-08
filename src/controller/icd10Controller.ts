import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import CodeFilter from "@/services/codeFilter";
import TextFilter from "@/services/textFilter";

export class ICD10Controller {
  private static icdRegex = new RegExp("[A-TV-Z][0-9][0-9].?[0-9A-TV-Z]{0,4}", "i");
  private static stripRegex = new RegExp("[ -]+");

  public static getFiltered(searchstring: string): Fuse.FuseResult<ICodeSystem_Concept>[] {
    const searchTerms: string[] = ICD10Controller.splitTerms(searchstring);
    const icd10Codes: string[] = ICD10Controller.filterCodes(searchTerms);

    if (icd10Codes.length > 0) {
      const codeResponse = CodeFilter.initSearch(icd10Codes);
      if (codeResponse.length > 0) return codeResponse;
    }

    const searchResult = TextFilter.initSearch(searchTerms);

    // copy the results before removing extensions, otherwise
    // we would change the actual database we are searching on
    const searchResultCopy = JSON.parse(JSON.stringify(searchResult));
    return ICD10Controller.removeExtensions(searchResultCopy);
  }

  private static isICD10Code(str: string): boolean {
    return ICD10Controller.icdRegex.test(str);
  }

  private static filterCodes(terms: string[]): string[] {
    return terms.filter((term) => ICD10Controller.isICD10Code(term));
  }

  private static splitTerms(str: string): string[] {
    return str.split(ICD10Controller.stripRegex);
  }

  /**
   * Remove extensions added in ICD10gm.preProcessCodeSystem()
   *
   * ICD10gm.preProcessCodeSystem() adds extensions to the FHIR objects in
   * order to facilitate better search results. Those extensions are invalid
   * according to the FHIR standard though (not having an .url field). Therefor
   * the extensions need to be removed before delivery of the search results.
   *
   * Fixes https://github.com/dot-base/icd-10-api/issues/24
   */
  private static removeExtensions(
    res: Fuse.FuseResult<ICodeSystem_Concept>[]
  ): Fuse.FuseResult<ICodeSystem_Concept>[] {
    res.forEach((r) => (r.item.extension = r.item.modifierExtension = undefined));
    return res;
  }
}