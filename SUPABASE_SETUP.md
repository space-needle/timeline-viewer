# Supabase Project Setup Instructions

To connect the timeline application to your own Supabase backend for authentication and data storage, follow these steps.

## 1. Create a Supabase Project

1.  Go to [supabase.com](https://supabase.com) and sign up or log in.
2.  Click on "New Project".
3.  Choose your organization and give your project a name (e.g., "TimelineApp").
4.  Generate a secure database password and save it somewhere safe.
5.  Choose a region that is closest to you.
6.  Click "Create new project".

## 2. Find Your API Keys

Once your project is created:

1.  In the left sidebar of your Supabase project dashboard, click on the **Settings** icon (the gear).
2.  In the settings menu, click on **API**.
3.  You will find your **Project URL** and your **Project API Keys**. You need the `anon` (public) key.

## 3. Add Keys to the Web App

1.  Open the `script.js` file in the project.
2.  Near the top of the file, you will find the following lines:

    ```javascript
    const SUPABASE_URL = 'YOUR_SUPABASE_URL_HERE';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';
    ```

3.  Replace the placeholder strings with the actual **URL** and **anon key** you copied from your Supabase project settings.
4.  Save the file.

Your web application is now connected to your Supabase backend!
