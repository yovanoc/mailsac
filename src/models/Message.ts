import { IAttachment } from "./Attachment";
/*
  Permissions and Disposability
  By default, all emails sent to Mailsac are accepted and public. They are recycled regularly unless starred.

  Buying and reserving an email address means only you can see messages sent to it.

  Anyone can request messages on a public (non-owned) inbox. Anyone can also delete messages from public inboxes.
*/

/*
  Example Recipient Object
  {
    "name": "Bill Jones",
    "address": "billjones@example.com"
  }

  Field   Description

  name    friendly email name, optional part of the transport so may be empty string
  address email address
*/

export interface IRecipient {
  address: string;
  name: string;
}

/*
// Example Email Message Object
// {
//     "_id": "wLf7biMiadm6fPXHVE",
//     "from": [Recipient],
//     "to": [Recipient],
//     "cc": [Recipient],
//     "bcc": [Recipient],
//     "subject": "hi bobby",
//     "savedBy": "bob",
//     "originalInbox": "test@example.com",
//     "inbox": "test@example.com",
//     "domain": "example.com",
//     "received": "2016-08-16T02:59:13.406Z",
//     "size": "6821",
//     "attachments": ["def20078c72e1e72043e910734e5efbc"],
//     "ip": "195.3.2.7",
//     "via": "8.55.32.199",
//     "folder": "inbox",
//     "labels": ["Events"],
//     "read": false,
//     "rtls": true,
//     "links": ["https://google.com"]
// }
//
// Field         Description
//
// _id           unique identifier of the email
// from          array of Recipient objects (see below)
// to            array of Recipient objects (see below)
// cc            array of Recipient objects (see below)
// bcc           array of Recipient objects (see below)
// subject       email subject line
// savedBy       when starred, this is the Account._id
// originalInbox same as inbox unless sent to the encryptedInbox
// inbox         email address to which this message belongs
// domain        hostname domain for the inbox
// received      ISO 8601 date and time string
// size          content length in bytes of the original raw email message
// attachments   null or array of MD5 hashes of attachments
// ip            remote SMTP server that sent the mail to the server at via
// via           IP address of SMTP server that received the message from ip
// folder        inbox folder, one of: inbox, all, sent, spam, trash, drafts
// labels        array of strings - custom inbox labels
// read          read status - true=read, false=unread
// rtls          received over TLS (encrypted)
// links         list of any URLs that were found in the message contents
*/

export interface IMessage {
  _id: string;
  from: IRecipient[];
  to: IRecipient[];
  cc: IRecipient[];
  bcc: IRecipient[];
  subject: string;
  savedBy: string;
  originalInbox: string;
  inbox: string;
  domain: string;
  received: string;
  size: number;
  attachments: string[];
  ip: string;
  via: string;
  folder: string;
  labels: string[];
  read: boolean;
  rtls: boolean;
  links: string[];
}

/*
{
  "limit": 30,
  "skip": 0,
  "unread": 0,
  "since": "2014-09-29",
  "messages": [{
    "inbox": "test@example.com",
    "to": [{
      "address": "test@example.com",
      "name": ""
    }],
    "_id": "XOYj2t0MMe92286kf2hsOFNuPLxkjt3eQ",
    "from": [{
      "address": "tomriddle@example.com",
      "name": "Tom Riddle"
    }],
    "subject": "Page 2",
    "received": "2014-10-02T09:05:51.484Z",
    "originalInbox": "test@example.com",
    "size": 6210,
    "attachments": ["1e72043e910def20078c72e734e5efbc"]
  }, {
    "inbox": "test@example.com",
    "to": [{
      "address": "test@example.com",
      "name": ""
    }],
    "savedBy": "bob",
    "_id": "vUSsCSHLC9vJkYBPruWhyhTZJXOaIIrm-0",
    "from": [{
      "address": "nounverb@example.com",
      "name": "Noun Verb"
    }],
    "subject": "Weeping",
    "received": "2016-10-10T16:58:59.131Z",
    "originalInbox": "test@example.com",
    "size": 115313,
    "attachments": null
  }]
}
*/

export interface IInboxResponse {
  limit: number;
  skip: number;
  unread: number;
  since: Date;
  messages: IMessage[];
}

/*
  Query Params

  Field   Description

  limit   integer - how many messages to return
  skip    integer - how many messages to skip (like paging)
  unread  integer - how many messages in the response list are unread
  since   date / datetime - only fetch messages since this date or time
*/

export interface IInboxOptions {
  limit?: number;
  skip?: number;
  unread?: number;
  since?: Date;
}

export interface ISearchResponse {
  query: string;
  messages: IMessage[];
}

export interface ILabelsResponse {
  _id: string;
  labels: string[];
}

/*
  inbox - default
  all - all archived mail
  sent - sent mail outbox
  spam - spam is unsolicited email, phishing or otherwise unwanted
  trash - mail which will soon be deleted
  drafts - messages which have not yet been sent
*/
export enum FolderTypes {
  INBOX = "inbox",
  ALL = "all",
  SENT = "sent",
  SPAM = "spam",
  TRASH = "trash",
  DRAFTS = "drafts",
}

export interface IReadResponse {
  _id: string;
  read: boolean;
}

export interface IFolderResponse {
  _id: string;
  folder: string;
}

export interface IHeadersResponse {
  "dkim-signature": string;
  "received": string | string[];
  "x-facebook": string;
  "date": string;
  "to": string;
  "subject": string;
  "x-priority": string;
  "x-mailer": string;
  "return-path": string;
  "from": string;
  "reply-to": string;
  "errors-to": string;
  "x-facebook-notify": string;
  "list-unsubscribe": string;
  "x-facebook-priority": string;
  "x-auto-response-suppress": string;
  "require-recipient-valid-since": string;
  "message-id": string;
  "mime-version": string;
  "content-type": string;
  "x-mailsac-whitelist": string;
}

/*
  {
    "to": "someone@example.com",
    "from": "somebody@mailsac.com",
    "subject": "Hey",
    "text": "Message text body [2561a.jpg]",
    "html": "<div>Message text body <img src=3D\"F3011FGE@hsd1.ca.comcast.net.\"></div>",
    "attachments": [{
      "cid": "F3011FGE@hsd1.ca.comcast.net.",
      "contentDisposition": "inline; filename=2561a.jpg",
      "content": "3asfji32gia...93as==",
      "encoding": "base64",
      "filename": "2561a.jpg",
    }],
    "received": ["by 130.7.72.46 with SMTP id g633m40907;\n Fri, 12 Oct 2016 17:26:53 -0700 (PDT)"],
    "raw": "raw SMTP message",
  }

  Field       Description
  to          required - email addresses, currently capped at 3 - comma separated like
              a@example.com,b@example.com or as an array of recipient objects
  from        required - the email address to be sent from - must be a verified
              domain the account is allowed to send from, formats could be
              a string email address or an array of recipient objects
  subject     optional email subject line
  text        non-HTML body
  html        HTML body content
  attachments Array of attachment objects, see example code for format
  received    Array of strings (when multiple) or string of previous received header(s)
  raw         overrides all other fields; a raw SMTP message
*/

export interface ISendMessageOptions {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: IAttachment[];
  received?: string[];
  raw?: string;
}
