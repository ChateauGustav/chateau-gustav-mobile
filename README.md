# Château Gustav — Native App (iOS + Android)

A real Capacitor project wrapping the pairing tool for the App Store and
Google Play. The native iOS (`ios/`) and Android (`android/`) projects in
this folder are genuine, already-generated projects — not templates.

---

## Before you touch this folder

**Update the backend first.** The website's `api/pair.js` was updated
alongside this project to allow the app to call it (CORS). If you haven't
already, push that change to your `chateau-gustav-app` repo on GitHub the
same way you've updated everything else, and let it redeploy. The app
will not work until that's live.

---

## What you'll need on your Mac

- **Xcode** (free, from the Mac App Store) — required for iOS, no substitute
- **Android Studio** (free, from developer.android.com) — required for Android
- **Node.js** (free, from nodejs.org) — same as the website/app projects
- **An Apple Developer Program membership** — $99/year, developer.apple.com
- **A Google Play Console account** — $25 one-time, play.google.com/console

---

## No Mac? Build in the cloud with Codemagic instead

Everything in Steps 1–5 above can run on a real Mac in the cloud instead of
yours, using the `codemagic.yaml` file already included in this project.
Codemagic's free tier gives you 500 build minutes a month at no cost.

### One-time setup

1. **Push this project to GitHub** — same drag-and-drop process you've used
   for the website and the pairing app. Create a new repo (e.g.
   `chateau-gustav-mobile`) and upload everything **except** `node_modules`
   (Codemagic installs that itself, fresh, every build).
2. **Sign up at [codemagic.io](https://codemagic.io)** (free) and connect
   your GitHub account.
3. **Add the app** — Codemagic will detect the `codemagic.yaml` file
   automatically and offer both workflows (iOS and Android) already
   configured.

### iOS: setting up the credentials it needs

The iOS workflow needs four secret values, all from your Apple Developer
account, stored in Codemagic as an environment variable group:

1. In Codemagic, go to **Team settings → Environment variable groups**,
   create a new group named exactly `appstore_credentials`.
2. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com) →
   **Users and Access → Integrations → App Store Connect API** → generate
   a new key with **App Manager** access. This gives you three of the four
   values: the **Issuer ID**, the **Key ID**, and a downloadable `.p8` file
   (open it in a text editor — that text is your `APP_STORE_CONNECT_PRIVATE_KEY`).
3. Add all three as variables in that group:
   `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_KEY_IDENTIFIER`,
   `APP_STORE_CONNECT_PRIVATE_KEY`.
4. The fourth value, `CERTIFICATE_PRIVATE_KEY`, lets Codemagic generate
   your distribution certificate automatically — for a fresh app like this
   one, you can typically leave this blank and let Codemagic create
   everything automatically the first time it runs.
5. Separately, under **Team settings → Integrations**, connect your App
   Store Connect API key as a named integration. Use the same key from
   step 2. Name it `appstore_connect` — that exact name is what
   `codemagic.yaml` refers to for the automatic TestFlight upload.

### Android: setting up the keystore

1. You need a signing keystore. If you don't have one yet, generate one
   with this command (works on any computer with Java installed,
   including Windows/Linux — no Mac needed):
   ```bash
   keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias chateaugustav
   ```
   It'll ask you to set passwords and an alias — **write these down and
   back up the resulting `release-key.jks` file somewhere safe.** If you
   lose it, you can never update this app under the same listing again.
2. Convert it to text so it can be stored as an environment variable:
   ```bash
   base64 -i release-key.jks | pbcopy   # Mac
   base64 -w 0 release-key.jks          # Linux/Windows (copy the output manually)
   ```
3. In Codemagic, create a variable group named exactly `keystore_credentials`
   with four variables: `CM_KEYSTORE` (the base64 text from step 2),
   `CM_KEYSTORE_PASSWORD`, `CM_KEY_PASSWORD`, and `CM_KEY_ALIAS` (whatever
   you set when generating the keystore).

### Running a build

Back in Codemagic, click **Start new build**, pick a workflow (start with
Android — it's the simpler one to get right first), and watch it run. When
it finishes, the signed `.aab` is available right there to download and
upload manually to Google Play Console, or for iOS, it lands directly in
TestFlight, ready to install on your own iPhone.

---

## Step 1 — Install dependencies (Mac path)

Unzip this folder, open Terminal, navigate into it, then:

```bash
npm install
```

This re-downloads everything fresh for your Mac specifically — some of these
packages contain native binaries that are different per operating system, so
this step can't be skipped or shortcut even if you've run `npm install`
elsewhere before.

## Step 2 — Generate the full icon and splash screen set

The `assets/icon.png` and `assets/splash.png` files in this folder are the
*masters* — one one source image each. This command generates every size
both stores actually require (dozens of them) automatically:

```bash
npm run icons
```

## Step 3 — Sync and open the native projects

```bash
npx cap sync
npm run open:ios       # opens the real Xcode project
npm run open:android   # opens the real Android Studio project
```

You can run these one at a time — there's no need to do both right away.

---

## Step 4 — iOS: from Xcode to the App Store

1. In Xcode, select the **App** target → **Signing & Capabilities**.
2. Under **Team**, choose your Apple Developer account (sign in if prompted).
   Xcode will offer to fix any signing issues automatically — let it.
3. Plug in an iPhone (or just use a Simulator) and click **Run** (▶) to
   confirm it actually launches and a search returns real results — this
   confirms the CORS fix and the live backend connection are working.
4. In **App Store Connect** (appstoreconnect.apple.com), create a new app:
   - Bundle ID: `com.chateaugustav.pairing` (must match exactly)
   - Fill in the name, description, screenshots (Xcode's Simulator can take
     these — Cmd+S while running)
   - **Privacy Policy URL** — required; you'll need a real page for this
   - **Age rating questionnaire** — answer honestly about alcohol-related
     content; this is normal for a pairing/educational app and does not
     mean rejection, it just sets the age rating correctly
5. Back in Xcode: **Product → Archive**, then **Distribute App** → follow
   the prompts to upload to App Store Connect.
6. In App Store Connect, submit that build for review.

Apple's review typically takes 24–48 hours. If it comes back rejected,
read the specific reason carefully — it's almost always fixable, and the
message will tell you exactly what to address.

## Step 5 — Android: from Android Studio to Google Play

1. In Android Studio, let Gradle finish syncing (automatic on first open).
2. **Build → Generate Signed Bundle / APK** → choose **Android App Bundle**.
3. Create a new signing key when prompted — **save this key file somewhere
   safe and back it up.** If you lose it, you cannot update this app ever
   again under the same listing.
4. In **Google Play Console**, create a new app, fill in the listing
   (same screenshots/description as iOS, privacy policy URL, content
   rating questionnaire — same honesty note as above applies).
5. Upload the generated `.aab` file under **Production** (or start with
   **Internal testing** to try it yourself first — recommended).
6. Submit for review.

Google's review is often faster than Apple's, sometimes just a few hours.

---

## A few things worth knowing

**About the alcohol content question.** Apple's actual rule (guideline 1.4.3)
prohibits apps that *encourage excessive consumption* — it does not ban
wine, beer, or spirits apps outright. Vivino and many other wine apps live
on the App Store today. Because this app is educational (it recommends one
good pairing, not "drink more"), it's in a comfortable position. Just keep
any future app-store description copy in that same educational register.

**Privacy policy.** Both stores require a real, working URL to one. At
minimum, it should explain what the app does and doesn't collect (this app
doesn't collect personal data beyond what's needed to generate a pairing —
no accounts, no tracking). I can help you draft the actual page text
whenever you're ready; just ask. I'm not a lawyer, so treat that draft as a
starting point to have reviewed, not a final legal document.

**If Apple says it "doesn't add enough value."** Apple has gotten stricter
about apps that are just a website in a thin shell. The status bar styling,
splash screen, and offline-detection banner already built into this app
are there specifically to avoid that — they're real native behavior a
plain website tab can't replicate. If you want to go further (push
notifications when a new feature ships, saving favorite pairings on-device,
etc.), that's very doable later and would only strengthen this further.

**Updating the app later.** Any time you change `www/index.html` in this
project, you need to run `npx cap sync` again before opening Xcode/Android
Studio, or your changes won't show up in the native build.
