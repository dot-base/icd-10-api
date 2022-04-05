import { R4 } from "@ahryman40k/ts-fhir-types";
import io from "io-ts";
import icd10gm from "@/data/codesystem_icd10_gm_2020.json";
import logger from "@/logger";

class ICD10gm {
  public codesystem: R4.ICodeSystem;
  public processedCodesystem: R4.ICodeSystem;

  public constructor() {
    this.codesystem = ICD10gm.initCodesystem();
    this.processedCodesystem = ICD10gm.preProcessCodeSystem(this.codesystem);
  }

  private static initCodesystem(): R4.ICodeSystem {
    const icd10gmDecoded = R4.RTTI_CodeSystem.decode(icd10gm);

    if (icd10gmDecoded._tag === "Left") {
      const errors: string[] = ICD10gm.errorMessages(icd10gmDecoded.left);
      logger.error(`Initializing ICD10 codesystem from JSON failed. ${errors.join("\n")}`);
      throw Error(`Initializing ICD10 codesystem from JSON failed. ${errors.join("\n")}`);
    }
    if (!R4.RTTI_CodeSystem.is(icd10gmDecoded.right))
      throw Error("Initializing ICD10 codesystem from JSON failed.");
    return <R4.ICodeSystem>icd10gmDecoded.right;
  }

  private static errorMessages(error: io.Errors): string[] {
    return error.map((err) => {
      return err.message ?? `Invalid value '${err.value}' at key '${err.context.slice(-1)[0].key}'`;
    });
  }

  /**
   * Removes all entries of other kind than "category" , like "chapter" or "block". Only specific ICD10 codes remain
   * Copies fields "display" and "inclusion" to extensions and removes all non-alphanumeric characters
   **/
  private static preProcessCodeSystem(codesystem: R4.ICodeSystem): R4.ICodeSystem {
    const processedCodesystem: R4.ICodeSystem = JSON.parse(JSON.stringify(codesystem));

    if (!processedCodesystem.concept) {
      logger.error("Preprocessing ICD10 codesystem from JSON failed");
      throw new Error("Preprocessing ICD10 codesystem from JSON failed");
    }

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

export default new ICD10gm();
