import type { Props } from "astro";
import IconMail from "@/assets/icons/IconMail.svg";
import IconGitHub from "@/assets/icons/IconGitHub.svg";
import { SITE } from "@/config";

interface Social {
  name: string;
  href: string;
  linkTitle: string;
  icon: (_props: Props) => Element;
}

export const SOCIALS: Social[] = [
  {
    name: "GitHub",
    href: SITE.profile,
    linkTitle: `${SITE.title} · GitHub`,
    icon: IconGitHub,
  },
  {
    name: "Mail",
    href: "mailto:schurfroggy@foxmail.com",
    linkTitle: `Email · ${SITE.title}`,
    icon: IconMail,
  },
] as const;

export const SHARE_LINKS: Social[] = [
  {
    name: "Mail",
    href: "mailto:?subject=Share%20this%20page&body=",
    linkTitle: "Share this post by email",
    icon: IconMail,
  },
] as const;
