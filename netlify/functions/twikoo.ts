/**
 * Netlify validation entry for Twikoo 2.0.7 + Jev.
 *
 * The build step compiles the workspace first. Import the generated Netlify
 * adapter so the validation path matches the published package layout closely.
 */
export { handler } from "../../packages/server-netlify/dist/index.mjs";
