import config from "config";
import { Client } from "../src";
import { FolderTypes } from "../src/models/Message";

const address = "azefaefafaezf@mailsac.com";
const messageId = "6qlynvR_mUkTlGz1nV4dMQ0Ao-0";

let publicClient: Client;
let privateClient: Client;

beforeAll(async (done) => {
  publicClient = new Client();
  privateClient = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Messages PUBLIC CLIENT", () => {
  it("should get all messages", async () => {
    expect.assertions(1);
    return expect(publicClient.getMessages(address)).rejects.toEqual({
      details: "Your API key is wrong or you are requesting something that belongs to someone else",
      message: "Not authorized. You may need to log in first.",
      status: 401
    })
  });
  it("should get a single message", async () => {
    expect.assertions(1);
    return expect(publicClient.getMessage(address, messageId)).rejects.toEqual({
      details: "The requested resource does not exist, or no longer exists, or the URL route is wrong",
      message: `No permission to view message ${messageId}`,
      status: 404
    });
  });
});

describe("Messages PRIVATE CLIENT", () => {
  it("should get messages", async () => {
    expect.assertions(1);
    return expect(privateClient.getMessages(address)).resolves.toBeInstanceOf(Array);
  });
  it("should get saved messages", async () => {
    expect.assertions(1);
    return expect(privateClient.getSavedMessages()).resolves.toBeInstanceOf(Array);
  });
  it("should get a single message", async () => {
    expect.assertions(1);
    return expect(privateClient.getMessage(address, messageId)).resolves.toMatchObject({
      _id: messageId
    });
  });
  it("should get private messages", async () => {
    expect.assertions(1);
    return expect(
      privateClient.getPrivateMessages({
        limit: 1
      })
    ).resolves.toMatchObject({
      messages: []
    });
  });
  it("should search private messages", async () => {
    expect.assertions(1);
    return expect(privateClient.searchPrivateMessages("test")).resolves.toHaveProperty("messages");
  });
  it("should save a message", async () => {
    expect.assertions(1);
    return expect(privateClient.saveMessage(address, messageId)).resolves.toMatchObject({
      _id: messageId
    });
  });
  it("should add label on a message", async () => {
    expect.assertions(1);
    return expect(privateClient.addMessageLabel(address, messageId, "TEST")).resolves.toBeTruthy();
  });
  it("should remove label on a message", async () => {
    expect.assertions(1);
    return expect(privateClient.removeMessageLabel(address, messageId, "TEST")).resolves.toBeTruthy();
  });
  it("should change message folder", async () => {
    expect.assertions(1);
    return expect(privateClient.changeMessageFolder(address, messageId, FolderTypes.SPAM)).resolves.toMatchObject({
      _id: messageId,
    });
  });
  it("should set message read/unread", async () => {
    expect.assertions(1);
    return expect(privateClient.setMessageRead(address, messageId, true)).resolves.toMatchObject({
      _id: messageId
    });
  });
  // TODO: test deleting message?
  it("should get message headers", async () => {
    expect.assertions(1);
    return expect(privateClient.getMessageHeaders(address, messageId, true)).resolves.toMatchObject({
      from: address
    });
  });
  it("should get sanitized message", async () => {
    expect.assertions(1);
    return expect(privateClient.getSanitizedMessage(address, messageId, true)).resolves.toEqual("<div>test</div>");
  });
  it("should get html message", async () => {
    expect.assertions(1);
    return expect(privateClient.getHTMLMessage(address, messageId, true)).resolves.toEqual("<div>test</div>");
  });
  it("should get text message", async () => {
    expect.assertions(1);
    return expect(privateClient.getMessageText(address, messageId, true)).resolves.toEqual("test");
  });
  it("should get raw message", async () => {
    expect.assertions(1);
    return expect(privateClient.getRawMessage(address, messageId, true)).resolves.toContain(`for <${address}>;`);
  });
  it("should send message", async () => {
    expect.assertions(1);
    return expect(privateClient.sendMessage({
      from: address,
      to: address,
      text: "Ahahahahah",
      subject: "Testing purposes :)",
    })).rejects.toEqual(
      {
        details: "Fix the validation error and try the request again",
        message: "You must purchase more outgoing messages before you can send.",
        status: 400
      }
    )
    // })).resolves.toMatchObject({
    //   from: address,
    //   to: [address]
    // });
  });
});
