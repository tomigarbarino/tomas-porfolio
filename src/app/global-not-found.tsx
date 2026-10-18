import { headers } from "next/headers";
import EnglishRoot from "@/views/root";
import SpanishRoot from "@/localized/es/views/root";
import EnglishMissing, { metadata as englishMetadata } from "@/views/missing";
import SpanishMissing, { metadata as spanishMetadata } from "@/localized/es/views/missing";

async function isSpanish() {
  return (await headers()).get("x-portfolio-locale") === "es";
}

export async function generateMetadata() {
  return await isSpanish() ? spanishMetadata : englishMetadata;
}

export default async function GlobalNotFound() {
  return await isSpanish() ? <SpanishRoot><SpanishMissing /></SpanishRoot> : <EnglishRoot><EnglishMissing /></EnglishRoot>;
}
