import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as config from "config";
import * as mocha from "mocha";
import { Client } from "../dist/mailsac";

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

let client: Client;

before((done) => {
  client = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Mail STATS", () => {
  it("should get top addresses", () =>  {
    return assert.isRejected(client.getBlacklistedDomainsAndIps());
  });
  it("should get top addresses", () =>  {
    return assert.isRejected(client.getTopAddresses({
      endDate: new Date(),
      limit: 10,
      startDate: new Date(2017, 12, 15, 12),
    }));
  });
  it("should get common attachments", () =>  {
    return assert.isRejected(client.getCommonAttachments({
      endDate: new Date(),
      limit: 10,
      startDate: new Date(2017, 12, 15, 12),
    }));
  });
  it("should count md5 attachments", () => {
    return assert.isRejected(client.countMD5Attachments("qC4068KcUG0ht6eBfnFcEtXs7"));
  });
  it("should get messages with attachment md5", () => {
    return assert.isRejected(client.getMessagesWitchAttachment("qC4068KcUG0ht6eBfnFcEtXs7"));
  });
  // TODO: Download common attachment
  it("should check blacklisted", () => {
    return assert.isFulfilled(client.checkBlacklist("google.com"));
  });
});
