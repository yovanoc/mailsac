import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as config from "config";
import * as mocha from "mocha";
import { Client } from "../dist/mailsac";

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

describe("User PUBLIC CLIENT", () => {
  it("should not get current user", () => {
    return assert.isRejected(publicClient.getCurrentUser());
  });
  it("should not get current user stats", () => {
    return assert.isRejected(publicClient.getCurrentUserStats());
  });
});

describe("User PRIVATE CLIENT", () => {
  it("should get current user", () => {
    return assert.isFulfilled(privateClient.getCurrentUser());
  });
  it("should get current user stats", () => {
    return assert.isFulfilled(privateClient.getCurrentUserStats());
  });
  it("should sign out", () => {
    return assert.isFulfilled(privateClient.signOut());
  });
});
