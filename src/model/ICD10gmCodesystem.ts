import { R4 } from "@ahryman40k/ts-fhir-types";
import * as io from "io-ts";
import icd10gm from "data/codesystem_icd10_gm_2020.json";

export class ICD10gm {
  private static instance: ICD10gm;
  public static codesystem: R4.ICodeSystem | undefined;
  public static processedCodesystem: R4.ICodeSystem | undefined;

  private ICD10gm() {
    ICD10gm.codesystem = ICD10gm.initCodesystem();
    ICD10gm.processedCodesystem = ICD10gm.preProcessCodeSystem();
  }

  public static getInstance(): ICD10gm {
    if (!ICD10gm.instance) {
      ICD10gm.instance = new ICD10gm();
    }
    return ICD10gm.instance;
  }

  private static initCodesystem(): R4.ICodeSystem {
    const icd10gmDecoded = R4.RTTI_CodeSystem.decode(icd10gm);

    if (!icd10gmDecoded.isRight())
      throw Error(
        "Initializing ICD10 codesystem from JSON failed: " + <io.Errors>icd10gmDecoded.value
      );
    return <R4.ICodeSystem>icd10gmDecoded.value;
  }

  /**
   * removes all entries of other kind than "category" , like "chapter" or
   * block", only specific ICD10 codes remain.
   * Removes non aplha-numeric characters between words from field "display"
   * */
  private static preProcessCodeSystem(): R4.ICodeSystem {
    const processedCodesystem: R4.ICodeSystem = JSON.parse(JSON.stringify(ICD10gm.codesystem));
    const stripRegex = new RegExp("[^0-9A-ZÄÖÜ]", "gi");

    if (!processedCodesystem.concept) throw new Error("Preprocessing ICD10 codesystem failed");

    processedCodesystem.concept = processedCodesystem.concept.filter((elem) => {
      return elem.property?.some((prop) =>
        prop.valueCode ? prop.valueCode === "category" && prop.code === "kind" : false
      );
    });
    processedCodesystem.concept.forEach((elem) => {
      elem.extension = [{ id: "displayCopy", valueString: elem.display?.replace(stripRegex, "") }];
      elem.property?.forEach((prop) => {
        if (prop.code === "inclusion") {
          elem.modifierExtension = [
            { id: "InclusionCopy", valueString: prop.valueString?.replace(stripRegex, "") },
          ];
        }
      });
    });

    return processedCodesystem;
  }
}
