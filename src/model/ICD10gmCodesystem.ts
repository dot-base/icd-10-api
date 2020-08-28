import { R4 } from "@ahryman40k/ts-fhir-types";
import * as io from "io-ts";
import icd10gm from "@/data/codesystem_icd10_gm_2020.json";

export default class ICD10gm {
  public static instance: ICD10gm;
  public codesystem: R4.ICodeSystem;
  public processedCodesystem: R4.ICodeSystem;

  private constructor() {
    this.codesystem = ICD10gm.initCodesystem();
    this.processedCodesystem = ICD10gm.preProcessCodeSystem(this.codesystem);
  }

  public static getInstance(): ICD10gm {
    if (!ICD10gm.instance) ICD10gm.instance = new ICD10gm();
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
   * Removes all entries of other kind than "category" , like "chapter" or "block". Only specific ICD10 codes remain
   * Copies fields "display" and "inclusion" to extensions and removes all non-alphanumeric characters
   **/
  private static preProcessCodeSystem(codesystem: R4.ICodeSystem): R4.ICodeSystem {
    const processedCodesystem: R4.ICodeSystem = JSON.parse(JSON.stringify(codesystem));

    if (!processedCodesystem.concept)
      throw new Error("Initializing ICD10 codesystem from JSON failed");

    processedCodesystem.concept = processedCodesystem.concept.filter((elem) =>
      elem.property ? ICD10gm.isTypeICDCode(elem.property) : false
    );

    processedCodesystem.concept = ICD10gm.trimAndCopySearchFields(processedCodesystem.concept);

    return processedCodesystem;
  }

  private static isTypeICDCode(property: R4.ICodeSystem_Property1[]) {
    return property.some((prop) =>
      prop.valueCode ? prop.valueCode === "category" && prop.code === "kind" : false
    );
  }

  private static trimAndCopySearchFields(
    concept: R4.ICodeSystem_Concept[]
  ): R4.ICodeSystem_Concept[] {
    const trimRegex = new RegExp("[^0-9A-ZÄÖÜ]", "gi");

    concept.forEach((elem) => {
      elem.extension = [{ id: "displayCopy", valueString: elem.display?.replace(trimRegex, "") }];

      elem.property?.forEach((prop) => {
        if (prop.code === "inclusion") {
          elem.modifierExtension = [
            { id: "InclusionCopy", valueString: prop.valueString?.replace(trimRegex, "") },
          ];
        }
      });
    });

    return concept;
  }
}
