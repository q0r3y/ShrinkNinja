### [Shrink Ninja](https://shrink.ninja) ###

A simple web URI link shortener created with node.js.

By default, links are erased from the database after 10 days.

Usage:

Place `shrink.ninja/` in front of any web URI. 

A `nin.sh` link with 4-6 random characters is generated that redirects to your input URI.

If you have a `nin.sh` link, and you want to view the web URI that it redirects to,
you can place the `nin.sh` link after `shrink.ninja/` and the 
[shrink.ninja](https://shrink.ninja) website will display the web URI it was generated from.

Example:

 * Shrink:
   * `https://welovelongurls.com/...`
   * `shrink.ninja/https://welovelongurls.com/...`
   * `nin.sh/ttwi6` -> `https://welovelongurls.com/...`
   

 * Expand:
    * `shrink.ninja/nin.sh/ttwi6`
    * `https://welovelongurls.com/...`

Api ( https://shrink.ninja/api/ )

 * Shrink:
   * Post:      `{ "shrinkUri" : "https://welovelongurls.com/..." }`
   * Response:  `{ "shortUrl": "nin.sh/57v3" }`


 * Expand:
   * Post: `{ "shrinkUri" : "nin.sh/57v3" }`
   * Response: `{ "shortCode": "57v3", "shortUrl": "nin.sh/57v3",
                "longUrl": "https://welovelongurls.com/...",
                "creationDate": "2022-05-27T16:32:23.582Z" }`
