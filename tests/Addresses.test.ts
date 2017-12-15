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

describe("Addresses PUBLIC CLIENT", () => {

  it("should not get private addresses", () => {
    return assert.isRejected(publicClient.getPrivateAddresses(), "Not authorized. You may need to log in first");
  });
});

describe("Addresses PRIVATE CLIENT", () => {
  it("should get private addresses", () => {
    return assert.isFulfilled(privateClient.getPrivateAddresses());
  });

  it("should check address ownership", () => {
    return assert.isFulfilled(privateClient.checkAddressOwnership("super@mailsac.com"));
  });

  it("should reserve an address", () => {
    return assert.isFulfilled(privateClient.reserveAddress("super@mailsac.com"));
  });

  it("should release an address", () => {
    return assert.isRejected(privateClient.releaseAddress("super@mailsac.com"));
  });

  it("should forward an address", () => {
    return assert.isRejected(privateClient.forwardAddress("super@mailsac.com", {
      enablews: true,
      forward: null,
      webhook: null,
    }));
  });
});
