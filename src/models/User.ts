/*
  Field                 Description

  _id                   account username
  email                 account email address (optional)
  messageLimit          maximum allowed message history: starred messages + all messages on private addresses
  sendsRemaining        number of outbound recipients left to be able to send a message to
  catchAll              catch-all domain address, unused credits
  privateAddressCredits number of private addresses that the account is entitled to but has not yet reserved
  recents               short list of recently viewed inboxes
  apiAccess             indicates this is a paid API subscription account when > 0
*/

export interface IUser {
  _id: string;
  email?: string;
  messageLimit: number;
  sendsRemaining: number;
  catchAll: number;
  privateAddressCredits: number;
  recents: string[];
  apiAccess: number;
}

/*
  {
    "storedMessages": 40,
    "starredMessages": 14,
    "addresses": [
        "example@mailsac.com",
        "mailsac@example.com"
    ],
    "nonOwnedInboxes": [
        "some-public-addr@mailsac.com"
    ],
    "inboxBytes": 15248
  }

  Field           Description

  addresses       list of owned private addresses
  nonOwnedInboxes list of email addresses where user has starred messages but does not own the email address itself
  starredMessages total count of saved messages
  storedMessages  total messages on all private addresses owned by the account
  inboxBytes      sum size of all messages on private addresses
*/

export interface IUserStats {
  storedMessages: number;
  starredMessages: number;
  addresses: string[];
  nonOwnedInboxes: string[];
  inboxBytes: number;
}

export interface ISignOutResult {
  ok: boolean;
}
