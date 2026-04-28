import { BLOG_PATH } from "@/content.config";
import { slugifyStr } from "./slugify";

type CollectionPathOptions = {
  sourceBasePath: string;
  routeBasePath: string;
  includeBase?: boolean;
};

export function getCollectionPath(
  id: string,
  filePath: string | undefined,
  { sourceBasePath, routeBasePath, includeBase = true }: CollectionPathOptions
) {
  const pathSegments = filePath
    ?.replace(sourceBasePath, "")
    .split("/")
    .filter(path => path !== "")
    .filter(path => !path.startsWith("_"))
    .slice(0, -1)
    .map(segment => slugifyStr(segment));

  const basePath = includeBase ? routeBasePath : "";

  const contentId = id.split("/");
  const slug = contentId.length > 0 ? contentId.slice(-1) : contentId;

  if (!pathSegments || pathSegments.length < 1) {
    return [basePath, slug].join("/");
  }

  return [basePath, ...pathSegments, slug].join("/");
}

/**
 * Get full path of a blog post
 * @param id - id of the blog post (aka slug)
 * @param filePath - the blog post full file location
 * @param includeBase - whether to include `/posts` in return value
 * @returns blog post path
 */
export function getPath(
  id: string,
  filePath: string | undefined,
  includeBase = true
) {
  return getCollectionPath(id, filePath, {
    sourceBasePath: BLOG_PATH,
    routeBasePath: "/posts",
    includeBase,
  });
}
