import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as config from "config";
import * as mocha from "mocha";
import { Client } from "../src/Client";

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

let publicClient: Client;
let privateClient: Client;

before((done) => {
  publicClient = new Client();
  privateClient = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Attachments PUBLIC CLIENT", () => {
  //
});

describe("User PRIVATE CLIENT", () => {
  it("should get attachments", () => {
    return assert.isFulfilled(privateClient.getAttachments("azefaefafaezf@mailsac.com",
      "8zyvIpiEfja3e7Hh2J877TWPanM1gIjE-0"));
  });
  // TODO: Download attachment
});
