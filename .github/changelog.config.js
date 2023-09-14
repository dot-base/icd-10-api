"use strict";
const config = require("conventional-changelog-conventionalcommits");

module.exports = config({
  types: [
    { type: "feat", section: ":rocket: New Features" },
    { type: "perf", section: ":racing_car: Performance" },
    { type: "fix", section: ":fire_extinguisher: Bugs" },
    { type: "chore", section: ":broom: Chore" },
  ],
});
