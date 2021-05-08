import config from "config";
import { Client } from "../src";

describe("mailsac", () => {
  it("should create a client without apiKey", () => {
    const client = new Client();
    return expect(client.apiKey).toEqual(undefined);
  });

  it("should create a client with apiKey", () => {
    const client = new Client(config.get("MAILSAC_API_KEY"));
    return expect(client.apiKey).not.toEqual(undefined);
  });
});
