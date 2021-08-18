# What is this website?

It's the website for English Garden Talk Press built using SvelteKit and TypeScript. Because of the lack of need for dynamic updates, the app can be built entirely statically and needs no access to SSR. All contact data and published books (which is publically accessible data anyway) is contained within the src/data/writing.ts file.

## How do I run it?

1. Clone/fork the repository
2. npm install
3. npm run dev

All other commands can be found in package.json, including building. Currently the dev command is configured to expose the files on the network. Remove --host from the dev command to disable this feature.

This is the first time that I used SvelteKit and the first time that I used Tailwind CSS, so I'm sure I didn't do a fantastic job with either. That said, it seems to be functional.

## Planned Updates

* Media queries
* Make the site look better

## Changes I may make

* Add testing

## Changelog:
* 8/17/2021: Initial release and a little bit of media queries
* 8/18/2021:
> * Change transitions for BookTransition, add second set of buttons to SlideShow on small media queries;
> * Found out that when building for production (not dev!) img src routes default to the static/ folder!
> * Prepared for a Vercel deployment