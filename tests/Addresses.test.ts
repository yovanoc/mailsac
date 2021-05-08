import config from "config";
import { Client } from "../src";

let publicClient: Client;
let privateClient: Client;

beforeAll((done) => {
  publicClient = new Client();
  privateClient = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Addresses PUBLIC CLIENT", () => {

  it("should not get private addresses", async () => {
    expect.assertions(1);
    await expect(publicClient.getPrivateAddresses()).rejects.toEqual({
      details: "Your API key is wrong or you are requesting something that belongs to someone else",
      message: "Not authorized. You may need to log in first.",
      status: 401
    });
  });
});

describe("Addresses PRIVATE CLIENT", () => {
  it("should get private addresses", async () => {
    expect.assertions(1);
    await expect(privateClient.getPrivateAddresses()).resolves.toEqual([]);
  });

  it("should check address ownership", async () => {
    expect.assertions(1);
    await expect(privateClient.checkAddressOwnership("super@mailsac.com")).resolves.toEqual({
      available: true,
      email: "super@mailsac.com",
      owned: false
    });
  });

  it("should reserve an address", async () => {
    expect.assertions(1);
    await expect(privateClient.reserveAddress("super@mailsac.com")).rejects.toEqual(
      {
        details: "Fix the validation error and try the request again",
        message: "You do not have enough private address credits (0). Please purchase more.",
        status: 400
      }
    );
  });

  it("should release an address", async () => {
    expect.assertions(1);
    await expect(privateClient.releaseAddress("super@mailsac.com")).rejects.toEqual(
      {
        details: "Fix the validation error and try the request again",
        message: "That address is not valid. Make sure it is one you own.",
        status: 400
      }
    );
  });

  it("should forward an address", async () => {
    expect.assertions(1);
    await expect(privateClient.forwardAddress("super@mailsac.com", {
      enablews: true,
      forward: null,
      webhook: null,
    })).rejects.toEqual({
      details: "The requested resource does not exist, or no longer exists, or the URL route is wrong",
      message: "The private address was not found for this user.",
      status: 404
    });
  });
});
