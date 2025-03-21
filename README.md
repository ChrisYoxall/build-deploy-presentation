# CI/CD Presentation #

Add this file to the root of RevealJS files from https://revealjs.com/



## React Single Page Application (SPA) ##

Simple application to call the C# back-end demo service.

Configured to use [Volta](https://volta.sh/) to manage the version of Node.js and pnpm to use. If using Volta then
simply do the following in this directory:

- pnpn i
- pnpm start

If you don't want to use Volta, and have Node.js and other package managers installed (i.e. yarn)
you should be able to use those instead.

### Viewing the built files locally ###

Running the package.json 'build' script will generate a website that can be viewed locally, however you won't be simply
able to view the index.html file in your browser due to a CORS error since a local file isn't regarded as coming from
the same origin. For more information see [this](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS/Errors/CORSRequestNotHttp) page.

To get around this, probably the easiest approach is use the Node 'http-server' package by doing:

    npx http-server dist -p 8080

Or if you have Python installed:

    python3 -m http.server --directory dist