## Installation

With `yarn`

```
$ yarn global add seopage
```

With `npm`

```
$ npm i -g seopage
```

## Example Configuration File

```json
// config.json
{
  "fbAppId": "00000000",
  "fbAdmins": "admin.one,admin.two",
  "gaid": "UA-000000000-1",
  "siteName": "Your Website",
  "lang": "en-GB",
  "type": "website",
  "url": "https://yourwebsite.kom",
  "thumbnail": "/public/thumb.jpg",
  "title": "",
  "description": "",
  "keywords": ""
}
```

> Note: fields can be overriden by CLI flags

## Example Usage

Initialise a basic directory structure under current working directory

```
$ seopage init
```

Add meta tags for social media (default)

```
$ seopage --file=[path to HTML file]
```

Use a configuration file

```
$ seopage -c [path to configuration file] --file=[path to HTML file]
```

Output directory (default to ./out)

```
$ seopage -o [path of output directory] --file=[path to HTML file]
```

Google Analytics Tracking ID

```
$ seopage -g [your tracking ID] --file=[path to HTML file]
```

Document language code

```
$ seopage -l en-GB -f [path to HTML file]
// <html lang="en-GB">
```

Thumbnail

```
$ seopage -t [URL link to thumbnail photo] -f [path to HTML file]
```
