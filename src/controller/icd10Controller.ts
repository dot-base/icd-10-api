import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { CodeFilter } from "@/services/codeFilter";
import { TextFilter } from "@/services/textFilter";
import { Filter } from '@/services/filter';

export const getFiltered = async (searchstring: string): Promise<JSON | string> => {
  let response: Fuse.FuseResult<ICodeSystem_Concept>[] = [];
  const searchTerms: string[] = searchstring.split(new RegExp("[ -]+"));
  const icd10Codes: string[] = searchTerms.filter((term) => ICD10Controller.isICD10Code(term));
  if (icd10Codes) response = CodeFilter.search(icd10Codes);
  if (response.length < 1) response = TextFilter.search(searchTerms);
  return response ? JSON.parse(JSON.stringify(response)) : "not defined";
};

class ICD10Controller {
  static isICD10Code(str: string): boolean {
    const regEx = new RegExp("[A-TV-Z][0-9][0-9]?.?[0-9A-TV-Z]{0,4}");
    return regEx.test(str);
  }
}
