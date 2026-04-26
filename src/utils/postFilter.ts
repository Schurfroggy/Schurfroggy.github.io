import type { ContentEntry } from "./contentEntry";

/** Non-draft posts always appear in listings after deploy (no scheduled/future-date hiding). */
const postFilter = ({ data }: ContentEntry) => !data.draft;

export default postFilter;
