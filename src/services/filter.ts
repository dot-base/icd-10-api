import Fuse from "fuse.js";
import { ICodeSystem_Concept } from "@ahryman40k/ts-fhir-types/lib/R4";
import { QueryOptions } from "@/types/queryOptions";
import FuseSearch from "@/services/fuseSearch";

export default abstract class Filter extends FuseSearch {
  protected static queryOptions: QueryOptions;
  protected static keys: Fuse.FuseOptionKeyObject[];

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public static initSearch(terms: string[]): Fuse.FuseResult<ICodeSystem_Concept>[] {
    throw new Error("Error: Called method 'search' on abstract class Filter.");
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  protected static getQuery(queryStr: string[] | string): void {
    throw new Error("Error: Called method 'setQuery' on abstract class Filter.");
  }
}
