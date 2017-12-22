import * as chai from "chai";
import * as config from "config";
import * as mocha from "mocha";
import { Client } from "../dist/mailsac";

const expect = chai.expect;

describe("mailsac", () => {
  it("should create a client without apiKey", () => {
    const client = new Client();
    return expect(client.apiKey).eq(undefined);
  });

  it("should create a client with apiKey", () => {
    const client = new Client(config.get("MAILSAC_API_KEY"));
    return expect(client.apiKey).not.eq(undefined);
  });
});
