import axios, { AxiosInstance, AxiosRequestConfig, Method } from "axios";
import { ErrorCodes, IMailsacError } from "./JsonError";
import { IAddress, IForwardOptions, IOwned } from "./models/Address";
import { IAttachment } from "./models/Attachment";
import {
  FolderTypes, IFolderResponse, IHeadersResponse, IInboxOptions,
  IInboxResponse, ILabelsResponse,
  IMessage, IReadResponse, ISearchResponse, ISendMessageOptions,
} from "./models/Message";
import { ISignOutResult, IUser, IUserStats } from "./models/User";

export interface ICountResponse {
  _id: string;
  n: number;
}

/**
 * Querystring Param  Format      Description
 * startDate          date (UTC)  Required - Limit results to inboxes that received messages after this date.
 * endDate            date (UTC)  Required - Limit results to inboxes that received messages before this date.
 * limit              integer     Optional - Limit results to this many, default 20, max 1000.
 * skip               integer     Optional - Skip this many, default 0.
 */
export interface IQueryOptions {
  startDate: Date;
  endDate: Date;
  limit?: number;
  skip?: number;
}

export class Client {

  public apiKey?: string;
  private axios: AxiosInstance;

  constructor(apiKey?: string, timeout = 3000) {
    this.apiKey = apiKey;
    this.axios = axios.create({
      baseURL: "https://mailsac.com/api/",
      // headers: {
      //   "Mailsac-Key": this.apiKey ? this.apiKey : "",
      // },
      timeout,
    });
  }

  /**
   * Get an array of private inbox address objects for the account.
   * @return {Promise<IAddress[]>} address list
   */
  public getPrivateAddresses(): Promise<IAddress[]> {
    return this.request<IAddress[]>("/addresses");
  }

  /**
   * Get a single address object.
   * Returns an object if owned by the user or not owned.
   * Returns 401 if owned by other user.
   * @param  {string}            email email
   * @return {Promise<IAddress>}       Address
   */
  public getAddress(email: string): Promise<IAddress> {
    return this.request<IAddress>(`/addresses/${email}`);
  }

  /**
   * Check if an address is private (AKA owned).
   * @param  {string}          email email
   * @return {Promise<IOwned>}       owned
   */
  public checkAddressOwnership(email: string): Promise<IOwned> {
    return this.request<IOwned>(`/addresses/${email}/availability`);
  }

  /**
   * Reserve ownership of a private email address.
   * No POST body is required.
   * Returns 200 if successfully reserves the address.
   * Returns 401 if owned by other user.
   * Returns 400 if it is already owned by the user.
   * @param  {string}            email email
   * @return {Promise<IAddress>}       address
   */
  public reserveAddress(email: string): Promise<IAddress> {
    return this.request<IAddress>(`/addresses/${email}`, "post");
  }

  /**
   * Release ownership of a private address.
   * Returns 200 if successfully releases the address.
   * Returns 401 if owned by other user.
   * Returns 400 if it is not owned.
   * @param  {string}        email email
   * @return {Promise<void>}       void
   */
  public releaseAddress(email: string): Promise<void> {
    return this.request(`/addresses/${email}`, "delete");
  }

  /**
   * For a privately owned address email, set it to forward to another email.
   * @param  {string}        email email
   * @return {Promise<void>}       void
   */
  public forwardAddress(email: string, options: IForwardOptions): Promise<void> {
    return this.request(`/private-address-forwarding/${email}`, "put", { data: options });
  }

  /**
   * This is how to check the mail. Get a list of messages for the :email address.
   * The objects are abbreviated to provide basic metadata.
   * @param  {string}              email email
   * @return {Promise<IMessage[]>}       message list
   */
  public getMessages(email: string): Promise<IMessage[]> {
    return this.request<IMessage[]>(`/addresses/${email}/messages`);
  }

  /**
   * Get a list of messages that have been saved and made private for the user.
   * @return {Promise<IMessage[]>} message list
   */
  public getSavedMessages(): Promise<IMessage[]> {
    return this.request<IMessage[]>("/addresses/starred/messages");
  }

  /**
   * Get an individual message.
   * @param  {string}            email     email address
   * @param  {string}            messageId the Mailsac Message._id
   * @return {Promise<IMessage>}           message
   */
  public getMessage(email: string, messageId: string): Promise<IMessage> {
    return this.request<IMessage>(`/addresses/${email}/messages/${messageId}`);
  }

  /**
   * This is how to check the mail across all of an account's private email addresses.
   * @param  {IInboxOptions}           options IInboxOptions
   * @return {Promise<IInboxResponse>}         response
   */
  public getPrivateMessages(options?: IInboxOptions): Promise<IInboxResponse> {
    return this.request<IInboxResponse>("/inbox");
  }

  /**
   * Search for messages in private address. query matches the to, from, and subject.
   * @param  {string}               query query
   * @return {Promise<ISearchResponse>}   response
   */
  public searchPrivateMessages(query: string): Promise<ISearchResponse> {
    return this.request<ISearchResponse>("/inbox-search", "get", { params: { query } });
  }

  /**
   * Toggle starred status so it will not be automatically removed.
   * There is no PUT body.
   * It returns only the message metadata.
   * @param  {string}            email     email
   * @param  {string}            messageId messageId
   * @return {Promise<IMessage>}           message
   */
  public saveMessage(email: string, messageId: string): Promise<IMessage> {
    return this.request<IMessage>(`/addresses/${email}/messages/${messageId}/star`, "put");
  }

  /**
   * Add a label to a message
   * To help organize messages and group messages together, add a label to a message. Labels are used in the Inbox UI to group messages.
   * When successful, returns 200 with a subset of the message object.
   * When the label already exists on the message, the message is not modified and the API endpoint returns 200.
   * No PUT body is needed.
   * @param  {string}                   email     email
   * @param  {string}                   messageId messageId
   * @param  {string}                   label     label
   * @return {Promise<ILabelsResponse>}           response
   */
  public addMessageLabel(email: string, messageId: string, label: string): Promise<ILabelsResponse> {
    return this.request<ILabelsResponse>(`/addresses/${email}/messages/${messageId}/labels/${encodeURIComponent(label)}`,
      "put");
  }

  /**
   * Remove a label from a message
   * Removes a label from a message. Returns 200 with a subset of the message object when successful.
   * When the label did not exists on the message, the message is not modified and the API endpoint returns 200.
   * @param  {string}                   email     email
   * @param  {string}                   messageId messageId
   * @param  {string}                   label     label
   * @return {Promise<ILabelsResponse>}           response
   */
   public removeMessageLabel(email: string, messageId: string, label: string): Promise<ILabelsResponse> {
    return this.request<ILabelsResponse>(`/addresses/${email}/messages/${messageId}/labels/${encodeURIComponent(label)}`,
      "delete");
  }

  /**
   * Move the message to a different mail folder.
   * No PUT body is needed.
   * No other folders can be added. To organize mail, use labels.
   * @param  {string}                   email     email
   * @param  {string}                   messageId messageId
   * @param  {FolderTypes}              folder    folder
   * @return {Promise<IFolderResponse>}           response
   */
  public changeMessageFolder(email: string, messageId: string, folder: FolderTypes): Promise<IFolderResponse> {
    return this.request<IFolderResponse>(`/addresses/${email}/messages/${messageId}/folder/${folder}`, "put");
  }

  /**
   * Change the read state of a message. No PUT body is needed.
   * Pass read as true to mark the message as read, and false to mark it as unread. The default is false - unread.
   * @param  {string}                 email     email
   * @param  {string}                 messageId messageId
   * @param  {boolean}                read      read
   * @return {Promise<IReadResponse>}           response
   */
  public setMessageRead(email: string, messageId: string, read: boolean = false): Promise<IReadResponse> {
    return this.request<IReadResponse>(`/addresses/${email}/messages/${messageId}/read/${read}`, "put");
  }

  /**
   * Permanently removes a message. There is no history or trash bin.
   * @param  {string}        email     email
   * @param  {string}        messageId messageId
   * @return {Promise<void>}           void
   */
  public deleteMessage(email: string, messageId: string): Promise<void> {
    return this.request(`/addresses/${email}/messages/${messageId}`, "delete");
  }

  /**
   * Get the SMTP headers from an email message.
   * Use the querystring param ?download=1 to trigger file download in browser.
   * @param  {string}        email          email
   * @param  {string}        messageId      messageId
   * @param  {boolean}        download=false download
   * @return {Promise<IHeadersResponse>}    void
   */
  public getMessageHeaders(email: string, messageId: string, download: boolean = false): Promise<IHeadersResponse> {
    return this.request<IHeadersResponse>(`/headers/${email}/${messageId}`,
      "get", download ? { params: { download: 1 } } : undefined);
  }

  /**
   * Get safe HTML from an email message. Scripts, images and links are stripped out.
   * Use the querystring param ?download=1 to trigger file download in browser.
   * @param  {string}          email          email
   * @param  {string}          messageId      messageId
   * @param  {boolean}          download=false download
   * @return {Promise<string>}                response
   */
  public getSanitizedMessage(email: string, messageId: string, download = false): Promise<string> {
    return this.request<string>(`/body/${email}/${messageId}`, "get",
      download ? { params: { download: 1 } } : undefined);
  }

  /**
   * Get a message's HTML content.
   * Attached images are inlined and nothing has been stripped.
   * Use the querystring param ?download=1 to trigger file download in browser.
   * @param  {string}          email          email
   * @param  {string}          messageId      messageId
   * @param  {[type]}          download=false download
   * @return {Promise<string>}                response
   */
  public getHTMLMessage(email: string, messageId: string, download = false): Promise<string> {
    return this.request<string>(`/dirty/${email}/${messageId}`, "get",
      download ? { params: { download: 1 } } : undefined);
  }

  /**
   * Get a message's text content.
   * Use the querystring param ?download=1 to trigger file download in browser.
   * @param  {string}          email          email
   * @param  {string}          messageId      messageId
   * @param  {boolean}          download=false download
   * @return {Promise<string>}                response
   */
  public async getMessageText(email: string, messageId: string, download: boolean = false): Promise<string> {
    return this.request<string>(`/text/${email}/${messageId}`, "get",
      download ? { params: { download: 1 } } : undefined);
  }

  /**
   * The entire original SMTP message transport message.
   * Use the querystring param ?download=1 to trigger file download in browser.
   * @param  {string}          email          email
   * @param  {string}          messageId      messageId
   * @param  {boolean}          download=false download
   * @return {Promise<string>}                response
   */
  public async getRawMessage(email: string, messageId: string, download: boolean = false): Promise<string> {
    return this.request<string>(`/raw/${email}/${messageId}`, "get",
      download ? { params: { download: 1 } } : undefined);
  }

  /**
   * Send transactional text-only email messages.
   * Outgoing message credits must be purchased first.
   * One credit will be used per recipient (as opposed to per email).
   * Either text or html is required to send a message.
   * When passing a raw SMTP package it should be a full SMTP message.
   * All required fields below must be included in the raw package
   * @param  {ISendMessageOptions}          options options
   * @return {Promise<ISendMessageOptions>}         response
   */
  public sendMessage(options: ISendMessageOptions): Promise<ISendMessageOptions> {
    return this.request<ISendMessageOptions>(`/outgoing-messages`, "post", { data: options });
  }

  /**
   * Get Current User
   * @return {Promise<IUser>} user
   */
  public getCurrentUser(): Promise<IUser | null> {
    return this.request<IUser | null>(`/me`);
  }

  /**
   * Get information about non-owned addresses with starred
   * messages and total starred messages, and list of owned addresses.
   * @return {Promise<IUserStats>} stats
   */
  public getCurrentUserStats(): Promise<IUserStats> {
    return this.request<IUserStats>(`/me/stats`);
  }

  /**
   * Destroy the logged in user's session.
   * No POST body.
   * For cookie auth which works on the website only.
   * @return {Promise<ISignOutResult>} result
   */
  public signOut(): Promise<ISignOutResult> {
    return this.request<ISignOutResult>(`/auth/logout`, "post");
  }

  /**
   * List the metadata for all attachments on a message.
   * @param  {string}                    email     email
   * @param  {string}                    messageId messageId
   * @return {Promise<IAttachment[]>}    attachments list
   */
  public getAttachments(email: string, messageId: string): Promise<IAttachment[]> {
    return this.request<IAttachment[]>(`/addresses/${email}/messages/${messageId}/attachments`);
  }

  /**
   * Download an attachment on a message.
   * The Content-Type will be set to the contentType field from the attachment metadata.
   * @param  {string}        email        email
   * @param  {string}        messageId    messageId
   * @param  {string}        attachmentId attachmentId
   * @return {Promise<void>}              void
   */
  public downloadAttachment(email: string, messageId: string, attachmentId: string): Promise<void> {
    return this.request<void>(`/addresses/${email}/messages/${messageId}/attachments/${attachmentId}`);
  }

  /**
   * Search for attachments that were received during the requested time period.
   * Limited to non-private inboxes.
   * @param  {IQueryOptions}     options options
   *                                        Field  Description
   *                                        id     MD5 hash of the attachment file
   *                                        n      count of messages with this attachment
   * @return {Promise<ICountResponse[]>}         common attachments list
   */
  public getCommonAttachments(options: IQueryOptions): Promise<ICountResponse[]> {
    return this.request<ICountResponse[]>(`/mailstats/common-attachments`, "get", { params: options });
  }

  /**
   * Count the number of email messages that have attachments with this MD5 sum.
   * Limited to non-private inboxes.
   * @param  {string}          md5 md5
   * @return {Promise<number>}     number
   */
  public countMD5Attachments(md5: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.request<any>(`/mailstats/common-attachments/${md5}/count`)
        .then((response) => resolve(response.n))
        .catch((err) => reject(err));
    });
  }

  /**
   * List the email messages that have attachments with the requested MD5 sum.
   * Limited to non-private inboxes.
   * @param  {string}              md5 MD5
   * @return {Promise<IMessage[]>}     messages
   */
  public getMessagesWitchAttachment(md5: string): Promise<IMessage[]> {
    return this.request<IMessage[]>(`/mailstats/common-attachments/${md5}`);
  }

  /**
   * Download an attachment with the MD5 sum requested.
   * Warning: attachments may contain viruses!
   * @param  {string}        md5 MD5
   * @return {Promise<void>}     void
   */
  public downloadCommonAttachment(md5: string): Promise<void> {
    return this.request<void>(`/mailstats/common-attachments/${md5}/download`);
  }

  /**
   * Search for the top non-private addresses that have been receiving mail.
   * @param  {IQueryOptions}           options options
   * @return {Promise<ICountResponse>}         response
   */
  public getTopAddresses(options: IQueryOptions): Promise<ICountResponse> {
    return this.request<ICountResponse>(`/mailstats/top-addresses`, "get", {
      params: options
    });
  }

  /**
   * Get an array of domains and IP addresses that have been
   * blacklisted for violating the terms of service and/or degrading the service experience for other customers.
   * @return {Promise<string[]>} blacklisted
   */
  public getBlacklistedDomainsAndIps(): Promise<string[]> {
    return this.request<string[]>(`/mailstats/blacklist`);
  }

  /**
   * Check if a domain or IP is on the blacklist.
   * Returns 404 if not blacklisted.
   * Returns 200 if blacklisted.
   * @param  {string}           domainOrIP domainOrIP
   * @return {Promise<boolean>}            blacklisted
   */
  public checkBlacklist(domainOrIP: string): Promise<boolean> { // TODO: finish this
    return new Promise((resolve, reject) => {
      this.request(`/mailstats/blacklist/${domainOrIP}`)
        .then((r) => console.log(r))
        .catch((r) => console.log(r));
      return resolve(true);
    });
  }

  private request<T>(url: string, method: Method = "get", config?: Partial<AxiosRequestConfig>): Promise<T> {
    return new Promise((resolve, reject) => {
      const request: AxiosRequestConfig = { ...{ method, url }, ...config };
      if (method === "get") {
        request.params = { ...request.params, ...{ _mailsacKey: this.apiKey ? this.apiKey : "" } };
      } else {
        request.data = { ...request.data, ...{ _mailsacKey: this.apiKey ? this.apiKey : "" } };
      }
      this.axios.request(request)
        .then((response) => resolve(response.data as T))
        .catch((error) => {
          if (error.response) {
            let details;
            switch (error.response.status) {
              case ErrorCodes.BAD_REQUEST:
                details = "Fix the validation error and try the request again";
                break;
              case ErrorCodes.UNAUTHORIZED:
                details = "Your API key is wrong or you are requesting something that belongs to someone else";
                break;
              case ErrorCodes.FORBIDDEN:
                details = "No matter how you repeat the request, it will not succeed with those credentials";
                break;
              case ErrorCodes.NOT_FOUND:
                details = "The requested resource does not exist, or no longer exists, or the URL route is wrong";
                break;
              case ErrorCodes.TEAPOT:
                details = "Short and stout";
                break;
              case ErrorCodes.RELAX:
                details = "Chill";
                break;
              case ErrorCodes.TOO_MANY_REQUESTS:
                details = "Please slow down your requests";
                break;
              case ErrorCodes.INTERNAL_SERVER_ERROR:
                details =
                  "We had a problem with our server and have been notified via our monitoring - try again later";
                break;
              case ErrorCodes.SERVICE_UNAVAILABLE:
                details = "We're temporarially offline for maintanance - try again later";
                break;
              default:
                details = "Default error message";
                break;
            }
            return reject({
              details,
              message: error.response.data.message ? error.response.data.message : error.response.data.error,
              status: error.response.status,
            } as IMailsacError);
          } else {
            return reject(error.message);
          }
        });
    });
  }
}
