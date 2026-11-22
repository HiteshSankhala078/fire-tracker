# Arav Fire Safety · Refill Tracker

Tamari potani app. Te Claude vagar chale che:

- **Android:** APK file direct install thay che. Refill reminder phone ma j aave che (7 divas pehla ane due date na divase, savare 9 vage).
- **iPhone ane PC:** website ne "Add to Home Screen" / "Install" kari ne app ni jem vapro.
- **Data:** tamara potana free Supabase account ma save thay che. Mobile ma entry nakho to PC ma turant dekhay.

Pehli vaar setup karta ~15 minute thay che. Pachhi kai karvanu nathi.

---

## Step 1 — Supabase (database) · ~5 min

1. https://supabase.com par jao → **Start your project** → Google/GitHub thi sign up karo.
2. **New project** banavo:
   - Name: `fire-tracker`
   - Database password: koi pan strong password (kyay save kari rakhjo)
   - Region: **South Asia (Mumbai)**
   - → **Create new project** dabavo ane 1–2 minute rah juo.
3. Dabi baju menu ma **SQL Editor** → **New query** kholo. `supabase/setup.sql` file ni aakhi content paste karo → **Run** dabavo. Niche "Success" dekhavu joie.
4. **Authentication → Users → Add user → Create new user**:
   - Tamaro email ane password nakho (aa thi j app ma login thase).
   - **Auto Confirm User** ✅ tick karo → Create.
5. *(Security mate)* **Authentication → Sign In / Providers** ma **"Allow new users to sign up"** OFF karo. Aanathi tamara sivay koi account nahi banavi shake.
6. **Project Settings → API** (athva upar nu **Connect** button) kholi ne be vastu copy karo:
   - **Project URL**: `https://xxxx.supabase.co`
   - **anon public / publishable key**
7. Aa project ma `www/config.js` file Notepad ma kholo ane te banne value tya paste karo:
   ```js
   supabaseUrl: "https://xxxx.supabase.co",
   supabaseKey: "eyJhbGciOi....",
   ```
   Save karo. (Aa key public use mate j che. Tamaro data login ane RLS policy thi surakshit che.)

## Step 2 — GitHub (free hosting + APK build) · ~8 min

1. https://github.com par account banavo (jo na hoy to).
2. Upar jamni baju **+ → New repository**:
   - Name: `fire-tracker`
   - **Public** rakho (free website hosting mate jaruri che. Repo ma tamaro koi data nathi, fakt app no code che.)
   - → **Create repository**
3. Navi repo ma **Settings → Pages → Build and deployment → Source: "GitHub Actions"** select karo.
4. Repo na main page par **"uploading an existing file"** link par click karo. Aa zip ni andar ni **badhi files ane folders** (`www`, `assets`, `ci`, `supabase`, `.github`, `package.json`, `package-lock.json`, `capacitor.config.json`, `README.md`, `.gitignore`) drag karo → **Commit changes**.
   - ⚠️ `.github` folder hidden hoy che, etle upload thayu ke nahi te check karjo. Jo na thayu hoy to: **Add file → Create new file** → name `.github/workflows/build.yml` lakho → `build.yml` ni content paste karo → Commit.
5. **Actions** tab kholo. "Build app" chalu thase (~6–8 min). Green ✅ aave etle taiyar.
6. Tamari app aa link par khulse:
   **`https://<tamaru-github-username>.github.io/fire-tracker/`**

## Step 3 — Install

**Android (APK — automatic reminder sathe)**
1. Phone na Chrome ma aa link kholo: `https://<username>.github.io/fire-tracker/app/arav-fire-tracker.apk`
   (athva website ma login karo → **More → Android app → Download**)
2. Download thai jay pachhi file kholo. Jo phone puche to **"Allow from this source / Install unknown apps"** ON karo → **Install**.
   - Jo Play Protect warning aave to → **More details → Install anyway** dabavo. Aa app Play Store mathi nathi etle aavi warning aave che.
3. App kholo → login karo → notification permission **Allow** karo.
4. **More → Phone reminders → Test** dabavo. 4 second ma test notification aavvu joie.
5. Saru result joie to: **Settings → Apps → Fire Tracker → Battery → Unrestricted** karo. Aanathi phone reminder band nahi kare.

**iPhone**
1. **Safari** ma website kholo → niche **Share ⬆ → Add to Home Screen** → Add.
2. Home screen parthi app kholo → login karo.
3. Reminder mate: entry kholo → **Calendar** → Google Calendar ma event add karo. (iPhone ma Apple direct install karva det nathi, etle automatic reminder fakt Android APK ma che.)

**PC (Chrome / Edge)**
- Website kholo → address bar ma jamni baju **Install** icon par click karo. Desktop par icon aavi jase.

## Pehli entries

App ma login karya pachhi dashboard par **"Import 5 certificates"** dabavo. Tamari document na 5 certificate PDF sathe add thai jase.

## Jaruri vaat

- **Supabase free plan** ma project **7 divas sudhi koi use na kare to pause thai jay che.** Tame app roj kholo cho etle aavu nahi thay. Jo kyarek pause thai jay to supabase.com par jai **Restore** dabavo. Tamaro data safe rahe che.
- Free plan ma: 500 MB database ane 1 GB documents (aashre 20,000+ certificate PDF) — tamara mate puratu che.
- **Backup:** More → Backup (CSV / JSON). Mahine ek vaar levu saru che.
- **App update karvi hoy to:** GitHub ma file badlo → Actions khud navu APK ane website banavse. Navu APK upar ni j link parthi download kari install karo. Juni app upar j update thase ane data jatu nahi rahe.

## Project files

| Path | Shu che |
|---|---|
| `www/` | Aakhi app (index.html, app.js, config.js, icons, offline support) |
| `www/seed/` | Tamara 5 certificate PDF + starter data |
| `supabase/setup.sql` | Database ane storage setup (ek vaar run karvu) |
| `.github/workflows/build.yml` | Website publish + Android APK build |
| `capacitor.config.json`, `package.json` | Android app settings |
| `assets/`, `ci/` | App icon, notification icon, APK signing key |
