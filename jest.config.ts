import type { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: "ts-jest",
    transform: {
      "^.+\\.(t|j)sx?$": "ts-jest",
    },
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    coverageDirectory: "./coverage/",
    collectCoverage: true,
    globals: {
      "ts-jest": {
        isolatedModules: true,
      },
    },
  };
};
