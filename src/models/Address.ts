/*
Example Email Address Object
{
  "_id": "asdf@example.com",
  "created": "2015-04-05T15:10:33.234Z",
  "enablews": true,
  "forward": "bill@example.com",
  "webhook": "https://example.com/email-callback",
  "owner": "jimbo",
  "encryptedInbox": "inbox-efeaefa6e78d9abba34c4"
}

Field           Description

_id             the unique identifier of this email address is the email address itself
created         ISO 8601 date and time string
enablews        boolean defaulting false indicating whether to publish messages
                via web socket when the user owning this inbox is subscribed
forward         email address where messages to this inbox will be forwarded
webhook         URL where messages to this inbox will be forwarded
owner           Account._id that owns the address (owns the privacy)
encryptedInbox  an alternate inbox prefix that will result in the message being delivered to this inbox _id
*/

export interface IAddress {
  _id: string;
  created: Date;
  enablews: boolean;
  forward: string;
  message?: string;
  webhook: string;
  owner: string;
  encryptedInbox: string;
}

export interface IOwned {
  available: boolean;
  email: string;
  owned: boolean;
}

/**
 * forward	email address - SMTP forwarding / standard email forwarding - set to "" or null to disable forwarding
 * enablews	boolean, defaults false - set to true to enable web socket forwarding (see Web Socket API)
 * webhook	url - set to your public webhook endpoint to receive mail via webhook - set to "" or null to disable webhooks
 * @type {string}
 */
export interface IForwardOptions {
  forward: string;
  enablews: boolean;
  webhook: string;
}
