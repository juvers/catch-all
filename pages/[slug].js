import { groq } from "next-sanity";
import { getClient } from "../lib/SanityConfig/sanity.server";

const xx = [
  {
    _key: "2ae9e6580806",
    _type: "DC2",
    compactImageOrVideo: {
      _type: "imageOrVideo",
      image: {
        _type: "imageType",
        alt: "img",
        asset: {
          _ref: "image-4d0d9745e4d2bc071575791da5bbc4ae54e9d06b-2000x1333-jpg",
          _type: "reference",
        },
      },
    },
    content: {
      _type: "columnContent",
      copy: "This is a copy sample extraction for content.",
      headLine: "Hero Headline Test",
      linkDestination: {
        _type: "link",
        url: "https://hzdg.com",
      },
      linkText: "learn more",
      tagLine: "Hero tagline test",
    },
    heroDimension: "Large",
    heroTitle: "Hero Test",
  },
  {
    _key: "15a36d821686",
    _type: "DC1",
    excerpt: "text excerpts",
    heading: "Text Content",
    image: {
      _type: "image",
      asset: {
        _ref: "image-c347fcdea8ed7dab0e4048ca5b2106e98810e0cf-1858x2071-jpg",
        _type: "reference",
      },
    },
    tagline: "text with illustrations",
  },
];

export default function Page({ data, allSubs, subSlug }) {
  return (
    <div>
      <p>All Data: {JSON.stringify(data)}</p>
    </div>
  );
}

export const getStaticPaths = async () => {
  const allSlugsQuery = groq`*[_type == 'page' && defined(slug.current)][].slug.current`;
  const pages = await getClient(null).fetch(allSlugsQuery);
  const paths = pages.map((slug) => {
    return {
      params: { slug },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params, preview = false }) => {
  const { slug } = params;
  // slug in this param reps slug above. avoided use of '${slug}'
  const query = groq`*[_type == 'page' && !(_id in path("drafts.**")) && slug.current == $slug]`;

  const queryParams = { slug };
  const data = await getClient(preview).fetch(query, queryParams);
  // const testPage = await getClient(preview).fetch(testP, queryParams);

  // const parentSlug = await data[0].slug.current;
  const subSlug = await data[0].subItems[0].slug.current;

  // create subnav
  const allSubs = await data[0].subItems.map(
    (x) => `${x.parentSlug?.current}/${x.slug?.current}`
  );
  if (!data) return { notFound: true };

  return {
    props: {
      allSubs,
      subSlug,
      preview,
      data: { data, queryParams },
    },
  };
};
