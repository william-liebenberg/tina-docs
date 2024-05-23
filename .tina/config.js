import { defineStaticConfig } from "tinacms";

const schema = {
  collections: [
    {
      label: "Documentation",
      format: "mdx",
      name: "docs",
      path: "docs",
      fields: [
        {
          type: "string",
          label: "Title",
          name: "title",
          isTitle: true,
          required: true,
        },
        {
          type: "string",
          label: "Intro Paragraph",
          name: "intro",
          description: "Shows up in large font under the title",
        },
        {
          type: "string",
          label: "Section",
          name: "section",
        },
        {
          type: "rich-text",
          label: "Body",
          name: "body",
          templates: [
            {
              name: "Callout",
              label: "Callout",
              ui: {
                defaultItem: {
                  type: "default",
                  text: "Lorem ipsum dolor sit amet.",
                },
              },
              fields: [
                {
                  name: "type",
                  label: "Type",
                  type: "string",
                  options: ["default", "warning", "error"],
                },
                {
                  name: "text",
                  label: "Text",
                  type: "string",
                },
              ],
            },
            {
              name: "Button",
              label: "Button",
              ui: {
                defaultItem: {
                  type: "primary",
                  text: "Learn More",
                  url: "https://tina.io",
                },
              },
              fields: [
                {
                  name: "type",
                  label: "Type",
                  type: "string",
                  options: ["primary", "success", "danger", "neutral"],
                },
                {
                  name: "text",
                  label: "Text",
                  type: "string",
                },
                {
                  name: "url",
                  label: "Url",
                  type: "string",
                },
              ],
            },
            {
              name: "VideoPlayer",
              label: "VideoPlayer",
              fields: [
                {
                  name: "url",
                  label: "Video URL",
                  type: "string",
                },
              ],
              ui: {
                defaultItem: {
                  url: "https://www.youtube.com/watch?v=_q1K7cybyRk",
                },
              },
            },
            // {
            //   name: "FeatureSection",
            //   label: "Feature",
            //   ui: {
            //     defaultItem: {
            //       featureList: [
            //         {
            //           image: "http://placehold.it/48x48",
            //           title: "Hello, World",
            //           desc: "Lorem ipsum dolor sit amet.",
            //         },
            //       ],
            //     },
            //   },
            //   fields: [
            //     {
            //       type: "object",
            //       name: "featureList",
            //       label: "Feature List",
            //       list: true,
            //       fields: [
            //         {
            //           name: "image",
            //           label: "Feature Image",
            //           type: "image",
            //         },
            //         {
            //           name: "title",
            //           label: "Feature Title",
            //           type: "string",
            //         },
            //         {
            //           name: "desc",
            //           label: "Feature Text",
            //           type: "string",
            //           ui: {
            //             component: "textarea",
            //           },
            //         },
            //       ],
            //     },
            //   ],
            // },
          ],
          isBody: true,
        },
      ],
      ui: {
        router: ({ document, collection }) => {
          if (["docs"].includes(collection.name)) {
            return `/docs/${document._sys.filename}`;
          }

          return undefined;
        },
      },
    },
  ],
};

export const config = defineStaticConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF || // Vercel branch env
    process.env.HEAD, // Netlify branch env
  token: process.env.TINA_TOKEN,
  media: {
    tina: {
      publicFolder: "public",
      mediaRoot: "images",
    },
  },
  ui: {
    previewUrl: (context) => {
      // Don't preview main
      if (context.branch === "main") return { url: "" };

      return {
        url: `https://tina-docs-demo-git-${decodeURIComponent(context.branch)
          ?.replace("/", "-")
          ?.replace(" ", "-")}-wicksipedias-projects.vercel.app`,
      };
    },
  },
  cmsCallback: (cms) => {
    cms.events.subscribe("branch:change", async ({ branchName }) => {
      console.log(`branch change detectted. setting branch to ${branchName}`);
      return fetch(`/api/preview?branchName=${branchName}`);
    });
    return cms;
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema,
  search: {
    tina: {
      indexerToken: process.env.SEARCH_TOKEN,
    },
    indexBatchSize: 100,
    maxSearchIndexFieldLength: 100,
  },
});

export default config;
