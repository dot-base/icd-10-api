import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import * as CodeFilter from "@/services/codeFilter";
import * as TextFilter from "@/services/textFilter";

export const getFiltered = async (searchstring: string): Promise<JSON> => {
  const icd10Controller = new ICD10Controller();

  const searchTerms: string[] = icd10Controller.stripTerms(searchstring);
  const icd10Codes: string[] = icd10Controller.filterCodes(searchTerms);

  let response: Fuse.FuseResult<ICodeSystem_Concept>[] = [];
  if (icd10Codes.length >= 1) response = CodeFilter.initSearch(icd10Codes);
  if (response.length < 1) response = TextFilter.initSearch(searchTerms);
  return JSON.parse(JSON.stringify(response));
};

class ICD10Controller {
  private icdRegex = new RegExp("[A-TV-Z][0-9][0-9].?[0-9A-TV-Z]{0,4}", "i");
  private stripRegex = new RegExp("[ -]+");

  private isICD10Code(str: string): boolean {
    return this.icdRegex.test(str);
  }

  filterCodes(terms: string[]): string[] {
    return terms.filter((term) => this.isICD10Code(term));
  }

  stripTerms(str: string): string[] {
    return str.split(this.stripRegex);
  }
}
