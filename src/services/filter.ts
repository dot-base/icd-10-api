import * as r4Codesystem from "../model/fhirR4Codesystem"
import Fuse from "fuse.js";



class Filter {
  static filterICD(str: string): string {
    const keys = ["code"];
    let query = [];
    if (!Filter.isICD10Code(str)) {
      keys.push("definition");
      query = [{ code: "=" + str }, { definition: "'" + str }];
    } else query = [{ code: "=" + str }];

    const base = r4Codesystem.ICD10gm.codesystem?.concept ? r4Codesystem.ICD10gm.codesystem.concept : [];
    const options = {
      useExtendedSearch: true,
      ignoreLocation: true,
      treshold: 0.1,
      keys: keys,
    };
    const index = Fuse.createIndex(options.keys, base);
    const fuse = new Fuse(base, options, index);
    const res = fuse.search({
      $or: [{ definition: "'" + str }, { code: "=" + str }],
    });
    return JSON.parse(JSON.stringify(res));
  }

  static isICD10Code(str: string): boolean {
    const regEx = new RegExp("[A-TV-Z][0-9][0-9].?[0-9A-TV-Z]{0,4}");
    return regEx.test(str);
  }
}

export const getFiltered = async (searchstring: string): Promise<string> => {
  const res = Filter.filterICD(searchstring);
  return res ? res : "not defined";
};
