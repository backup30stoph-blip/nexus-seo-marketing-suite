# Installation puter 
------------

[](https://www.npmjs.com/package/@heyputer/puter.js#installation)

### NPM:

[](https://www.npmjs.com/package/@heyputer/puter.js#npm)

```source-shell
npm install @heyputer/puter.js
```

### CDN:

[](https://www.npmjs.com/package/@heyputer/puter.js#cdn)

Include Puter.js directly in your HTML via CDN in the `<head>` section:

```text-html-basic
<script src="https://js.puter.com/v2/"></script>
```

Usage
-----

[](https://www.npmjs.com/package/@heyputer/puter.js#usage)

### Browser

[](https://www.npmjs.com/package/@heyputer/puter.js#browser)

#### ES Modules

[](https://www.npmjs.com/package/@heyputer/puter.js#es-modules)

```source-js
import {puter} from '@heyputer/puter.js';
// or
import puter from '@heyputer/puter.js';
// or
import '@heyputer/puter.js'; // puter will be available globally
```

#### CommonJS

[](https://www.npmjs.com/package/@heyputer/puter.js#commonjs)

```source-js
const {puter} = require('@heyputer/puter.js');
// or
const puter = require('@heyputer/puter.js');
// or
require('@heyputer/puter.js'); // puter will be available globally
```

#### Node.js (with Auth Token)

[](https://www.npmjs.com/package/@heyputer/puter.js#nodejs-with-auth-token)

```source-js
const {init} = require("@heyputer/puter.js/src/init.cjs"); // NODE JS ONLY
// or
import {init} from "@heyputer/puter.js/src/init.cjs";

const puter = init(process.env.puterAuthToken); // uses your auth token
const puter2 = init(process.env.puterAuthToken2); // use some other auth token
```

#### Node.js (with Auth Token + Web Login)

[](https://www.npmjs.com/package/@heyputer/puter.js#nodejs-with-auth-token--web-login)

```source-js
const {init, getAuthToken} = require("@heyputer/puter.js/src/init.cjs");
// or
import {init, getAuthToken} from "@heyputer/puter.js/src/init.cjs";

const authToken = await getAuthToken(); // performs browser based auth and retrieves token (requires browser)
const puter = init(authToken); // uses your auth token
```

Usage Example
-------------

[](https://www.npmjs.com/package/@heyputer/puter.js#usage-example)

After importing, you can use the global `puter` object:

```source-js
// Print a message
puter.print('Hello from Puter.js!');

// Chat with GPT-5 nano
puter.ai.chat('What color was Napoleon\'s white horse?').then(response => {
  puter.print(response);
});
```

Starter Templates
-----------------

[](https://www.npmjs.com/package/@heyputer/puter.js#starter-templates)

You can also use one of the following templates:

-   Client-side projects: [Angular](https://github.com/HeyPuter/angular), [React](https://github.com/HeyPuter/react), [Next.js](https://github.com/HeyPuter/next.js), [Vue.js](https://github.com/HeyPuter/vue.js), [Vanilla.js](https://github.com/HeyPuter/vanilla.js)
-   Node.js + Express: [Node.js + Express template](https://github.com/HeyPuter/node.js-express.js)

Setting Custom Origins
----------------------

[](https://www.npmjs.com/package/@heyputer/puter.js#setting-custom-origins)

By default puter.js uses the official Puter API and GUI origins. You can customize these origins by setting global variables before importing the SDK like so:

```source-js
// For API origin
globalThis.PUTER_API_ORIGIN = 'https://custom-api.puter.com';
// For GUI origin
globalThis.PUTER_ORIGIN = 'https://custom-gui.puter.com';

import {puter} from '@heyputer/puter.js'; // or however you import it for your env
```