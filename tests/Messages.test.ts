import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as config from "config";
import * as mocha from "mocha";
import { Client } from "../dist/mailsac";
import { FolderTypes } from "../src/models/Message";

chai.use(chaiAsPromised);

const expect = chai.expect;
const assert = chai.assert;

const address = "azefaefafaezf@mailsac.com";
const messageId = "RS34MfYnj5niVvETiu0OgelGMWHnoIWe-0";

let publicClient: Client;
let privateClient: Client;

before((done) => {
  publicClient = new Client();
  privateClient = new Client(config.get("MAILSAC_API_KEY"));
  done();
});

describe("Messages PUBLIC CLIENT", () => {
  it("should get messages", () => {
    return assert.isFulfilled(publicClient.getMessages(address));
  });
  it("should get a single message", () => {
    return assert.isRejected(publicClient.getMessage(address, messageId));
  });
});

describe("Messages PRIVATE CLIENT", () => {
  it("should get messages", () => {
    return assert.isFulfilled(privateClient.getMessages(address));
  });
  it("should get saved messages", () => {
    return assert.isFulfilled(privateClient.getSavedMessages());
  });
  it("should get a single message", () => {
    return assert.isRejected(privateClient.getMessage(address, messageId)); // TODO: Should be fulfilled ...
  });
  it("should get private messages", () => {
    return assert.isFulfilled(privateClient.getPrivateMessages());
  });
  it("should search private messages", () => {
    return assert.isFulfilled(privateClient.searchPrivateMessages("test"));
  });
  it("should save a message", () => {
    return assert.isFulfilled(privateClient.saveMessage(address, messageId));
  });
  it("should set labels on a message", () => {
    return assert.isRejected(privateClient.setMessageLabels(address, messageId, ["TEST"]));
  });
  it("should change message folder", () => {
    return assert.isFulfilled(privateClient.changeMessageFolder(address, messageId, FolderTypes.SPAM));
  });
  it("should set message read/unread", () => {
    assert.isFulfilled(privateClient.setMessageRead(address, messageId));
    return assert.isFulfilled(privateClient.setMessageRead(address, messageId, true));
  });
  // TODO: test deleting message?
  it("should get message headers", () => {
    assert.isFulfilled(privateClient.getMessageHeaders(address, messageId));
    return assert.isFulfilled(privateClient.getMessageHeaders(address, messageId, true));
  });
  it("should get sanitized message", () => {
    return assert.isFulfilled(privateClient.getSanitizedMessage(address, messageId, true));
  });
  it("should get html message", () => {
    return assert.isFulfilled(privateClient.getHTMLMessage(address, messageId, true));
  });
  it("should get text message", () => {
    return assert.isFulfilled(privateClient.getMessageText(address, messageId, true));
  });
  it("should get raw message", () => {
    return assert.isFulfilled(privateClient.getRawMessage(address, messageId, true));
  });
  it("should send message", () => {
    return assert.isRejected(privateClient.sendMessage({
      from: "test@test.com",
      raw: "Ahahahahah",
      subject: "Testing purposes :)",
      to: address,
    }));
  });
});
