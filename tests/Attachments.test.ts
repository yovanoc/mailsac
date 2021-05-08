import config from "config";
import { Client } from "../src";

let publicClient: Client;
let privateClient: Client;

beforeAll((done) => {
  publicClient = new Client();
  privateClient = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Attachments PUBLIC CLIENT", () => {
  //
});

describe("User PRIVATE CLIENT", () => {
  it("should get attachments", async () => {
    expect.assertions(1);
    return expect(privateClient.getAttachments("azefaefafaezf@mailsac.com",
      "RS34MfYnj5niVvETiu0OgelGMWHnoIWe-0")).rejects.toEqual({
        details: "The requested resource does not exist, or no longer exists, or the URL route is wrong",
        message: "Message not found by id RS34MfYnj5niVvETiu0OgelGMWHnoIWe-0 and inbox azefaefafaezf@mailsac.com",
        status: 404
      });
  });
  // TODO: Download attachment
});
