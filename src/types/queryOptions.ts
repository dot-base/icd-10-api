export interface QueryOptions {
  matchType: MatchType;
  logicalOperator: LogicalOperator;
}

export enum LogicalOperator {
  AND = " ",
  OR = " | ",
}

export enum MatchType {
  fuzzy = "",
  includes = "''",
  exactMatch = "=",
}
