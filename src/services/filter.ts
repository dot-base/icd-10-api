import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { QueryOptions } from "@/types/queryOptions";
import { FuseSearch } from "./fuseSearch";

export abstract class Filter extends FuseSearch {
  protected static queryOptions: QueryOptions;
  protected static keys: Fuse.FuseOptionKeyObject[];

  public static initSearch(terms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
    console.log("Called abstract initSearch for terms " + terms);
    throw new Error("Error: Called method 'search' on abstract class Filter.");
  }

  protected static getQuery(queryStr: string[] | string): void {
    console.log("Called abstract getQuery for value " + queryStr);
    throw new Error("Error: Called method 'setQuery' on abstract class Filter.");
  }
}
