import config from "config";
import { Client } from "../src";

let publicClient: Client;
let privateClient: Client;

beforeAll((done) => {
  publicClient = new Client();
  privateClient = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("User PUBLIC CLIENT", () => {
  it("should not get current user", async () => {
    expect.assertions(1);
    return expect(publicClient.getCurrentUser()).resolves.toEqual(null);
  });
  it("should not get current user stats", async () => {
    expect.assertions(1);
    return expect(publicClient.getCurrentUserStats()).rejects.toEqual({
      details: "Your API key is wrong or you are requesting something that belongs to someone else",
      message: "Not authorized. You may need to log in first.",
      status: 401,
      });
  });
});

describe("User PRIVATE CLIENT", () => {
  it("should get current user", async () => {
    expect.assertions(1);
    return expect(privateClient.getCurrentUser()).resolves.toMatchObject({
      _id: "yovano_c",
    });
  });
  it("should get current user stats", async () => {
    expect.assertions(1);
    return expect(privateClient.getCurrentUserStats()).resolves.toBeDefined();
  });
  it("should sign out", async () => {
    expect.assertions(1);
    return expect(privateClient.signOut()).resolves.toEqual({
      ok: true
    });
  });
});
