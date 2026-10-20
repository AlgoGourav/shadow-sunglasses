# Shadow waitlist

Both the homepage and cart forms POST to `/api/interest`. The server saves
submissions to `public.waitlist_entries` through the Supabase Data API. The
database enforces unique normalized emails, including concurrent submissions.
The table is private: RLS is enabled and browser roles have no privileges.
No email or SMS delivery service is configured; submissions are saved for follow-up.

## Setup

1. Create the `shadow-sunglasses` Supabase project in your own Free organization.
   Choose an Asia-Pacific region near India and save the database password.
2. Run `migrations/202610200001_waitlist.sql` in its SQL Editor once.
3. Copy `.env.example` to `.env.local`. Set `SUPABASE_URL` and
   `SUPABASE_SECRET_KEY` from the project's Connect/API Keys settings.
   Use the server secret (`sb_secret_...`); a legacy `service_role` key also works.
   Never use `NEXT_PUBLIC_` for this key or put it in Git.
4. Set the same two variables in your hosting provider and redeploy the site.
5. Add the same two names as GitHub repository Actions secrets. Push the
   workflow to the default branch and run **Supabase database health** manually
   once to verify it. It subsequently runs every six hours (UTC, minute 23).
6. Submit both forms and confirm their rows and cart items in Table Editor.
   A duplicate email must not overwrite the original reservation.

For local maintenance commands, use Node 22+:

```sh
node --env-file=.env.local scripts/check-supabase.mjs
node --env-file=.env.local scripts/import-waitlist.mjs
```

The second command imports the legacy local JSON file without deleting it or
overwriting existing emails. Review that file for disposable test data before
importing it. It contains personal details and must remain ignored by Git.

## Free-tier activity

The external GitHub schedule calls a restricted database function. It checks the
waitlist relation and updates one timestamp in `service_health`; it never adds
dummy customers or returns personal data. An insert trigger cannot keep a quiet
database active, since it only fires when an insert already happens.

Supabase may pause Free projects with insufficient activity over seven days.
This schedule generates database activity but is not a guarantee: GitHub can
delay jobs, secrets can expire, and paused projects must be resumed in the
Supabase dashboard. Enable Actions failure notifications and watch for Supabase
pause-warning emails. A paid plan is the documented way to avoid inactivity
pausing. Private-repository Actions runs use the account's included minutes.

Reference: https://supabase.com/docs/guides/platform/free-project-pausing
