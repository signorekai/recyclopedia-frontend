Recyclopedia Frontend is a [Next.js](https://nextjs.org/) project. Check out the [system requirements](https://nextjs.org/docs/getting-started/installation) for development.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [https://localhost:3000](https://localhost:3000) with your browser to see the result.

## In case Alfred gets hit by a truck

1. Go to `Settings > General > Advanced > Export Project`. Wait for the export to complete, and download the exported file.
2. Create a new project/repository ("+" icon at the top left corner of Gitlab interface).
3. Select "Import project".
4. Follow the instructions and upload the downloaded project export file. Make sure that the Project URL namespace is under your own username.
5. Go to [Vercel](https://vercel.com/) and sign it with your Gitlab account.
6. Add a new project and search for the repository you just created on Gitlab.
7. Once created, go to `Settings > Environment Variables`.
8. You will need to create these following environment variables that are essentially meant for consuming APIs from other services:

- `ALGOLIA_APP_ID` - login to our Algolia project and head to `Settings > Team and Access > API Keys`. The value is the "Application ID".
- `ALGOLIA_API_KEY` - login to our Algolia project and head to `Settings > Team and Access > API Keys`. The value is the "Search-Only API Key".
- `NEXT_PUBLIC_LOCATION` - value: "https://recyclopedia.sg"
- `NEXTAUTH_URL` - value: "https://recyclopedia.sg/api/auth"
- `FACEBOOK_CLIENT_ID` - login to [Facebook Developer](https://developer.facebook.com) and access the Recyclopedia project. Head to `[App Settings > Basic](https://developers.facebook.com/apps/249690553871674/settings/basic/?business_id=2133048443679704)`. The value is the "App ID". Used for Facebook Login.
- `FACEBOOK_CLIENT_SECRET` - login to [Facebook Developer](https://developer.facebook.com) and access the Recyclopedia project. Head to [`App Settings > Basic`](https://developers.facebook.com/apps/249690553871674/settings/basic/?business_id=2133048443679704). The value is the "App secret". Used for Facebook Login.
- `GOOGLE_ID` - login to [Google Cloud](https://console.cloud.google.com/apis/credentials?project=recyclopedia-366701). Head to `Credentials > OAuth 2.0 Client IDs > Recyclopedia.sg`. The value is the "Client ID", and should end with a `.apps.googleusercontent.com`. Used for Google Login.
- `GOOGLE_SECRET` - login to [Google Cloud](https://console.cloud.google.com/apis/credentials?project=recyclopedia-366701). Head to `Credentials > OAuth 2.0 Client IDs > Recyclopedia.sg`. The value is the "Client Secret".
- `RECAPTCHA_SECRET_KEY` - login to [reCAPTCHA admin panel](https://www.google.com/recaptcha/admin/). Select the Recyclopedia project, and go to Settings. The value is the "Secret Key".
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - login to [reCAPTCHA admin panel](https://www.google.com/recaptcha/admin/). Select the Recyclopedia project, and go to Settings. The value is the "Site Key".
- `NEXT_PUBLIC_API_URL` - value: "https://cms.recyclopedia.sg/api".
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - login to [Google Analytics](https://analytics.google.com/analytics/web/#/a245628113p337393474/admin/streams/table/4150385524). The value is the "Measurement ID".
- `API_URL` - value: "https://cms.recyclopedia.sg/api".
- `API_KEY` - login to [`Recyclopedia CMS > Settings > API Tokens`](https://cms.recyclopedia.sg/admin/settings/api-tokens) and "Create new API Token". The name can be anything, though it is advised that you put something descriptive. Select "Full Access" for Token type. Save, and the token will be shown. Copy and paste that as the value in Vercel's dashboard.
- `CONTENT_UPDATE_KEY` - go to [API token generator](https://generate-random.org/api-token-generator?count=1&length=256&type=mixed-numbers-symbols&prefix=) and generate a token of at least 256-bit length. Copy and paste that as the value in Vercel's dashboard.

9. Once you have created all of the environment variables, you need to rebuild the site so that it will be built with the new environment variables. Head to the "Deployments" page of the newly created project in Vercel's dashboard, and select the latest deployment. For a newly created site, there should only be one deployment, and it should have failed due to missing environment variables. Select the kebab menu (vertical 3 dots button) and select "Redeploy".
10. Wait for the site to finish building.
11. Check if the deployment is working properly - check the latest deployment, and "Visit" the site. The site should load & work properly.
12. Time to setup the domain. Head to `Settings > Domains` and add `https://recyclopedia.sg` to the project. Select the first option in the popup modal, which should be the recommended option (add www.recyclopedia.sg and redirect recyclopedia.sg to it).
13. Configure the [Recyclopedia CMS "Incremental Server Rendering" webhook](https://cms.recyclopedia.sg/admin/settings/webhooks/2) - the value of the "Authorization" key should be in this format: `Bearer <XYZ>`, where <XYZ> is the value for the `CONTENT_UPDATE_KEY` environment value. Save your changes.
14. The domain should point to your Vercel project now!
