# Mailsac

Mailsac API Library

## Installation

 * In the browser

   ```html
   <script type="text/javascript" src="https://unpkg.com/mailsac"></script>
   ```

   and

   ```javascript
   const Client = new mailsac.Client("API_KEY");
   ```

 * In Node.js

   ```
   $ npm install mailsac
   ```

   and

   ```javascript
   const Client = require("mailsac").Client;
   ```

   or in es6 or TypeScript

   ```javascript
   import { Client } from "mailsac";
   ```

## Development

  You have to rename the config/default.example.json to config/default.json and put your mailsac api in order to run tests

 * Prerequisites

   ```
   $ npm install
   ```

* Lint the ts files

    ```
    $ npm run lint
    ```
    or to fix some errors automatically
    ```
    $ npm run lint:fix
    ```  
* Run the tests
    ```
    $ npm run test
    ```  

* Build the js files

    ```
    $ npm run build
    ```  

## Contributing

All contributions are welcome! If you wish to contribute, please create an issue first so that your feature, problem or question can be discussed.
