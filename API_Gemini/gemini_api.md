# Free, Unlimited Gemini API
==========================


This tutorial will show you how to use [Puter.js](https://developer.puter.com/) to access [Gemini's powerful language models](https://developer.puter.com/ai/google/) for free, without any API keys or usage restrictions. Using Puter.js, you can leverage models like [Gemini 3.1 Pro](https://developer.puter.com/ai/google/gemini-3.1-pro-preview/), [Gemini 3.1 Flash Lite](https://developer.puter.com/ai/google/gemini-3.1-flash-lite-preview/), [Gemini 3 Flash](https://developer.puter.com/ai/google/gemini-3-flash-preview/), and [Gemini 3 Pro](https://developer.puter.com/ai/google/gemini-3-pro-preview/) for various tasks like text generation, image analysis, and complex reasoning, text and code generation, and more.

Puter is the pioneer of the ["User-Pays" model](https://docs.puter.com/user-pays-model/), which allows developers to incorporate AI capabilities into their applications while users cover their own usage costs. This model enables developers to [access advanced AI capabilities](https://developer.puter.com/ai/) for free, without any API keys or sign-ups.

Getting Started
---------------

Puter.js works without any API keys or sign-ups. To start using Puter.js, include the following script tag in your HTML file, either in the `<head>` or `<body>` section:

```
<script src="https://js.puter.com/v2/"></script>

```

You're now ready to use Puter.js for free access to Gemini capabilities. No API keys or sign-ups are required.

Example 1: Basic Text Generation with Gemini 3 Flash
----------------------------------------------------

Here's a simple example showing how to generate text using Gemini 3 Flash:

```
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat("Explain the concept of black holes in simple terms", {
            model: 'gemini-3-flash-preview'
        }).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>

```

Example 2: Using Gemini 3.1 Pro
-------------------------------

For comparison, here's how to use Gemini 3.1 Pro:

```
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat("What are the major differences between renewable and non-renewable energy sources?", {
            model: 'gemini-3.1-pro-preview'
        }).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>

```

Example 3: Cost-Efficient Generation with Gemini 3.1 Flash Lite
---------------------------------------------------------------

Gemini 3.1 Flash Lite is Google's fastest and most cost-efficient model in the Gemini 3 series, ideal for high-volume tasks like translation, classification, and content moderation:

```
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        puter.ai.chat("Classify the following text as positive, negative, or neutral: 'The product works well but the delivery was late.'", {
            model: 'gemini-3.1-flash-lite-preview'
        }).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>

```

Example 4: Streaming Responses
------------------------------

For longer responses, use streaming to get results in real-time:

```
<html>
<body>
    <div id="output"></div>
    <script src="https://js.puter.com/v2/"></script>
    <script>
        async function streamResponses() {
            const outputDiv = document.getElementById('output');

            // Gemini 3 Flash with streaming
            outputDiv.innerHTML += '<h2>Gemini 3 Flash Response:</h2>';
            const flashResponse = await puter.ai.chat(
                "Explain the process of photosynthesis in detail",
                {
                    model: 'gemini-3-flash-preview',
                    stream: true
                }
            );

            for await (const part of flashResponse) {
                if (part?.text) {
                    outputDiv.innerHTML += part.text.replaceAll('\n', '<br>');
                }
            }
        }

        streamResponses();
    </script>
</body>
</html>

```

Example 5: Comparing Models
---------------------------

Here's how to compare responses from multiple Gemini models:

```
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <script>
    (async () => {
        // Gemini 3 Flash
        const flash3_resp = await puter.ai.chat(
            'Tell me something interesting about quantum mechanics.',
            {model: 'gemini-3-flash-preview', stream: true}
        );
        puter.print('<h2>Gemini 3 Flash Response:</h2>');
        for await (const part of flash3_resp) {
            if (part?.text) {
                puter.print(part.text.replaceAll('\n', '<br>'));
            }
```

Show 41 more lines...

Example 6: Image Analysis
-------------------------

To analyze images, simply provide an image URL to [`puter.ai.chat()`](https://docs.puter.com/AI/chat/):

```
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <img src="https://assets.puter.site/doge.jpeg" id="image">
    <script>
        puter.ai.chat(
            "What do you see in this image?",
            "https://assets.puter.site/doge.jpeg",
            { model: 'gemini-3-flash-preview' }
        ).then(response => {
            puter.print(response);
        });
    </script>
</body>
</html>

```

All models
----------

The following Gemini models are available for free use with Puter.js:

```
gemini-3.1-flash-lite-preview
gemini-3.1-pro-preview
gemini-3-flash-preview
gemini-3-pro-preview
gemini-2.5-flash-lite-preview-09-2025
gemini-2.5-flash-preview-09-2025
gemini-2.5-flash-lite
gemini-2.5-pro-preview
gemini-2.5-pro-preview-05-06
gemini-2.5-flash
gemini-2.5-pro
gemini-2.0-flash-001
gemini-2.0-flash-lite-001
gemini-2.0-flash
gemini-2.0-flash-lite

```

Puter.js support for Gemini is not limited to text generation, you can also use it for image generation via Gemini 2.5 Flash/3 Pro Image, also known as Nano Banana! Please refer to the [Gemini Image Generation tutorial](https://developer.puter.com/tutorials/free-unlimited-nano-banana-api/) for more information.

That's it! You now have free access to Gemini's powerful language models using Puter.js. This allows you to add sophisticated AI capabilities to your web applications without worrying about API keys or usage limits.