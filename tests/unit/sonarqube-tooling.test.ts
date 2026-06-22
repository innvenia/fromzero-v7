import { describe, expect, it } from "vitest";

import {
  applySonarAliases,
  mapIssues,
  mapMeasures,
  mapQualityGate,
  parseDotEnv
} from "../../scripts/sonarqube.mjs";

describe("SonarQube local tooling", () => {
  it("parses dotenv values without requiring real secrets", () => {
    const parsed = parseDotEnv(`
      # comment
      SONARQUBE_URL=https://sonarqube.example.test
      SONARQUBE_TOKEN="synthetic-token"
      export SONARQUBE_PROJECT_KEY='fromzero-framework'
      EMPTY_VALUE=
      INVALID-NAME=ignored
    `);

    expect(parsed.get("SONARQUBE_URL")).toBe("https://sonarqube.example.test");
    expect(parsed.get("SONARQUBE_TOKEN")).toBe("synthetic-token");
    expect(parsed.get("SONARQUBE_PROJECT_KEY")).toBe("fromzero-framework");
    expect(parsed.get("EMPTY_VALUE")).toBe("");
    expect(parsed.has("INVALID-NAME")).toBe(false);
  });

  it("mirrors legacy Sonar variables to canonical names", () => {
    const envMap = applySonarAliases(
      new Map([
        ["SONAR_HOST_URL", "https://sonarqube.example.test"],
        ["SONAR_TOKEN", "synthetic-token"],
        ["SONAR_PROJECT_KEY", "fromzero-framework"]
      ])
    );

    expect(envMap.get("SONARQUBE_URL")).toBe("https://sonarqube.example.test");
    expect(envMap.get("SONARQUBE_TOKEN")).toBe("synthetic-token");
    expect(envMap.get("SONARQUBE_PROJECT_KEY")).toBe("fromzero-framework");
  });

  it("maps quality gate responses to stable output", () => {
    expect(
      mapQualityGate({
        projectStatus: {
          status: "OK",
          ignoredConditions: false,
          conditions: [
            {
              metricKey: "new_coverage",
              status: "OK",
              comparator: "LT",
              errorThreshold: "80",
              actualValue: "89.2"
            }
          ]
        }
      })
    ).toEqual({
      status: "OK",
      ignoredConditions: false,
      conditions: [
        {
          metricKey: "new_coverage",
          status: "OK",
          comparator: "LT",
          errorThreshold: "80",
          actualValue: "89.2"
        }
      ]
    });
  });

  it("maps measures and issues without exposing tokens", () => {
    expect(
      mapMeasures({
        component: {
          measures: [
            { metric: "coverage", value: "72.9" },
            { metric: "bugs", value: "0" }
          ]
        }
      })
    ).toEqual({ coverage: "72.9", bugs: "0" });

    expect(
      mapIssues({
        issues: [
          {
            key: "ISSUE-1",
            severity: "MAJOR",
            type: "CODE_SMELL",
            status: "OPEN",
            component: "fromzero-framework:src/index.ts",
            line: 10,
            message: "Synthetic issue"
          }
        ]
      })
    ).toEqual([
      {
        key: "ISSUE-1",
        severity: "MAJOR",
        type: "CODE_SMELL",
        status: "OPEN",
        component: "fromzero-framework:src/index.ts",
        line: 10,
        message: "Synthetic issue"
      }
    ]);
  });
});
