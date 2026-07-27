import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import {
  MaterialDetailPage,
  PostDetailPage,
} from "@/components/pages/content-detail-pages";
import {
  getPublishedMaterial,
  getPublishedPost,
} from "@/lib/content/collections";
import {
  getRoutePath,
  hasLocale,
  sectionMatchesLocale,
} from "@/lib/i18n";

type Params = Promise<{ locale: string; section: string; slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale, section, slug } = await params;
  if (!hasLocale(locale)) return {};
  const route = sectionMatchesLocale(section, locale);
  const record =
    route === "posts"
      ? await getPublishedPost(locale, slug)
      : route === "materials"
        ? await getPublishedMaterial(locale, slug)
        : null;
  if (!record) return {};
  return {
    title: record.title,
    description: "excerpt" in record ? record.excerpt : record.description,
    alternates: { canonical: `${getRoutePath(locale, route!)}/${record.slug}` },
  };
}

export default async function ContentDetailRoute({ params }: { params: Params }) {
  const { locale, section, slug } = await params;
  if (!hasLocale(locale)) notFound();
  const route = sectionMatchesLocale(section, locale);

  if (route === "posts") {
    const post = await getPublishedPost(locale, slug);
    if (!post) notFound();
    if (post.slug !== slug) permanentRedirect(`${getRoutePath(locale, "posts")}/${post.slug}`);
    return <PostDetailPage locale={locale} post={post} />;
  }

  if (route === "materials") {
    const material = await getPublishedMaterial(locale, slug);
    if (!material) notFound();
    if (material.slug !== slug) permanentRedirect(`${getRoutePath(locale, "materials")}/${material.slug}`);
    return <MaterialDetailPage locale={locale} material={material} />;
  }

  notFound();
}
