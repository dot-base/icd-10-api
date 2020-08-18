import { R4 } from "@ahryman40k/ts-fhir-types";
import * as io from "io-ts";
import icd10gm from "data/codesystem_icd10_gm_2020.json";

export class ICD10gm {
  public static codesystem: R4.ICodeSystem | undefined;
  public static codesystemPrefilteredText: R4.ICodeSystem | undefined;
  public static codesystemFailed: io.Errors | undefined;

  public static initCodesystem(): boolean {
    const icd10gmJson: R4.ICodeSystem = JSON.parse(JSON.stringify(icd10gm));
    const icd10gmDecoded = R4.RTTI_CodeSystem.decode(icd10gmJson);
    ICD10gm.codesystem = icd10gmDecoded.isRight()
      ? <R4.ICodeSystem>icd10gmDecoded.value
      : undefined;
    ICD10gm.codesystemFailed = ICD10gm.codesystem ? undefined : <io.Errors>icd10gmDecoded.value;
    return ICD10gm.codesystem ? true : false;
  }

  /**
   * removes all entries of other kind than "category" , like "chapter" or "block", only specific ICD10 codes remain
   * within remaining icd10 entries: remove all properties with property.code other than "inclusion"
   * removes non aplha-numeric characters (like -) and spaces between words from field "display"
   * */
  public static prefilterCodesystemForTextSearch(): boolean {
    ICD10gm.codesystemPrefilteredText = JSON.parse(JSON.stringify(ICD10gm.codesystem));
    const stripRegex = new RegExp("[^0-9A-ZÄÖÜ]", "gi");

    if (ICD10gm.codesystemPrefilteredText?.concept) {
      ICD10gm.codesystemPrefilteredText.concept = ICD10gm.codesystemPrefilteredText.concept.filter(
        (elem) => {
          return elem.property?.some((prop) =>
            prop.valueCode ? prop.valueCode === "category" && prop.code === "kind" : false
          );
        }
      );
      ICD10gm.codesystemPrefilteredText.concept.forEach((elem) => {
        elem.extension = [
          { id: "strippedDisplay", valueString: elem.display?.replace(stripRegex, "") },
        ];
        elem.property?.forEach((prop) => {
          if (prop.code === "inclusion") {
            elem.modifierExtension = [
              { id: "strippedInclusion", valueString: prop.valueString?.replace(stripRegex, "") },
            ];
          }
        });
      });
    }
    return true;
  }
}
