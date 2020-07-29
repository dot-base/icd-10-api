import { R4 } from "@ahryman40k/ts-fhir-types";
import * as io from "io-ts";
import icd10gm from "data/codesystem_icd10_gm_2020.json";

export class ICD10gm {
  public static codesystem: R4.ICodeSystem | undefined;
  public static codesystemFailed: io.Errors | undefined;

  public static initCodesystem() {
    const icd10gmJson: R4.ICodeSystem = JSON.parse(JSON.stringify(icd10gm));
    const icd10gmDecoded = R4.RTTI_CodeSystem.decode(icd10gmJson);

    ICD10gm.test = <R4.ICodeSystem>icd10gmDecoded.value;
    ICD10gm.codesystem = icd10gmDecoded.isRight() ? <R4.ICodeSystem>icd10gmDecoded.value : undefined;
    ICD10gm.codesystemFailed = ICD10gm.codesystem ? undefined : <io.Errors>icd10gmDecoded.value;
  }

}
