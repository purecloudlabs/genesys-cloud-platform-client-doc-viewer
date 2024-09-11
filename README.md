# genesys-cloud-platform-client-doc-viewer

A React app for viewing the Genesys Cloud platform client SDK documentation.


## Hosting using Github Pages

This app should be built using one of the app's package scripts, such as `npm run build:java`. The resulting app can then be hosted using Github Pages in the SDK's repo. Each SDK language's build command injects configuration variables used by the app to adjust the web paths used by the app. 

### Single Page App Workaround

Github Pages doesn't have any built-in configuration that will allow a single page app to be served for unknown file paths. It does allow a custom 404 error page, however. The `404.html` file in the `public` directory will be served by Github Pages for unknown file paths. That page uses the techniques described in [rafgraph/spa-github-pages](https://github.com/rafgraph/spa-github-pages) to load the React app. 
