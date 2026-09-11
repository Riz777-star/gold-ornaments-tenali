# Gold ornaments in Tenali

A mobile-friendly jewellery catalogue for Sd. Baji Shaied and Sd. Jaker Hussin. The business does not have a shop name; “Gold ornaments” is a description.

This is a prebuilt static website. It includes 1,353 attributed jewellery reference photographs, category filters, search, device-local favourites, enlarged photos, and an enquiry composer. Enquiries are prepared for the customer to copy; this website does not send messages or process payments.

## Current website

Public URL: https://riz777-star.github.io/gold-ornaments-tenali/

GitHub Pages publishes the static files from the root of the `main` branch. `.nojekyll` enables direct static serving. The repository is public at the owner's request.

GitHub Pages restricts use for online businesses and commercial transactions. Netlify remains an alternative for business hosting.

## Alternative deployment with Netlify

1. Sign in to Netlify and choose **Add new project → Import an existing project → GitHub**.
2. Grant access to this repository and select it.
3. Leave the build command empty. The publish directory is `.` and is configured in `netlify.toml`.
4. Publish the project and set its visibility to **Public**.
5. Verify the resulting `netlify.app` URL in a signed-out/private browser before sharing it with customers.

If you use this alternative, GitHub stores the source files and Netlify hosts the public website.

## Images and attribution

Jewellery catalogue photos belong to their respective source jewellery houses. Source links are stored in `gallery.json` and displayed in the picture viewer. Attribution does not establish permission for public republication. Confirm permission or replace third-party photographs with owned/licensed images before public launch.

The supplied portraits and illustrative hero are included. There is no blanket open-source license for the photo assets.

## Editing

`index.html` contains page content; `style.css` and `gallery.css` contain the presentation; `app.js` and `gallery.js` contain interactions. `gallery.json` is the catalogue. Thumbnail images are used in the grid and larger images in the detail view. Updates pushed to the connected branch can be deployed automatically by Netlify.
