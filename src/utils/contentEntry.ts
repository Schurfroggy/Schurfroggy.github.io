import type { CollectionEntry } from "astro:content";
import { NOVELLA_PATH } from "@/content.config";
import { getCollectionPath, getPath } from "./getPath";

export type ContentEntry =
  | CollectionEntry<"blog">
  | CollectionEntry<"galleries">
  | CollectionEntry<"novella">;

const isGalleryEntry = (
  entry: Pick<ContentEntry, "collection">
): entry is CollectionEntry<"galleries"> => entry.collection === "galleries";
const isNovellaEntry = (
  entry: Pick<ContentEntry, "collection">
): entry is CollectionEntry<"novella"> => entry.collection === "novella";

export const getGallerySlug = (id: string) =>
  id.replace(/\/index(?:\.(?:md|mdx))?$/, "");

export const getEntryPath = (
  entry: Pick<ContentEntry, "collection" | "id" | "filePath">
) =>
  isGalleryEntry(entry)
    ? `/galleries/${getGallerySlug(entry.id)}`
    : isNovellaEntry(entry)
      ? getCollectionPath(entry.id, entry.filePath, {
          sourceBasePath: NOVELLA_PATH,
          routeBasePath: "/novella",
        })
    : getPath(entry.id, entry.filePath);

export const getEntryPublishedMs = (entry: ContentEntry) => {
  const modDatetime =
    "modDatetime" in entry.data ? entry.data.modDatetime : null;
  return new Date(modDatetime ?? entry.data.pubDatetime).getTime();
};
