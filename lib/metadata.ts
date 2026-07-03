import type { Metadata } from "next";
import { site } from "@/lib/content";

export function pageMetadata(title: string, description?: string): Metadata {
  return {
    title: `${title} | ${site.name}`,
    description: description ?? site.description,
  };
}
