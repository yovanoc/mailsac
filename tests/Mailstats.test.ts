import config from "config";
import { Client } from "../src";

let client: Client;

beforeAll((done) => {
  client = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Mail STATS", () => {
  it("should get blacklisted domains and ips", async () => {
    expect.assertions(1);
    return expect(client.getBlacklistedDomainsAndIps()).resolves.toBeInstanceOf(Array);
  });
  it("should get top addresses", async () => {
    expect.assertions(1);
    const now = new Date();
    return expect(client.getTopAddresses({
      endDate: now,
      limit: 10,
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    })).resolves.toBeInstanceOf(Array);
  });
  it("should get common attachments", async () => {
    expect.assertions(1);
    const now = new Date();
    return expect(client.getCommonAttachments({
      endDate: now,
      limit: 10,
      startDate: new Date(now.getTime() - 1000 * 60 * 60 * 24),
    })).resolves.toBeInstanceOf(Array);
  });
  it("should count md5 attachments", async () => {
    expect.assertions(1);
    return expect(client.countMD5Attachments("qC4068KcUG0ht6eBfnFcEtXs7")).resolves.toEqual(0);
  });
  it("should get messages with attachment md5", async () => {
    expect.assertions(1);
    return expect(client.getMessagesWitchAttachment("qC4068KcUG0ht6eBfnFcEtXs7")).resolves.toEqual([]);
  });
  // TODO: Download common attachment
  it("should check blacklisted", async () => {
    expect.assertions(1);
    return expect(client.checkBlacklist("https://google.com")).resolves.toEqual(true);
  });
});
