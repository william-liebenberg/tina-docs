import DocLayout from "../../components/DocLayout";
import { sideMenuItems } from "../../utils/mdxUtils";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Button } from "../../components";
import Callout from "../../blocks/callout-block";
import ReactPlayer from "react-player/lazy";
import Page404 from "../404.js";
import { useTina, tinaField } from "tinacms/dist/react";
import { client } from "../../.tina/__generated__/client";

const components = {
  Callout: (props) => {
    return <Callout callout={props} />;
  },
  Button: (props) => {
    return (
      <Button as="a" href={props.url} variant={props.type}>
        {props.text}
      </Button>
    );
  },
  // FeatureSection: (props) => {
  //   return <FeaturesBlock features={props.featureList} />;
  // },
  VideoPlayer: (props) => {
    return <ReactPlayer controls="true" url={props.url} />;
  },
};

function DocPage(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  if (data && data.docs) {
    const sideNav = sideMenuItems(data);
    return (
      <DocLayout title={data.docs.title} navGroups={sideNav}>
        {
        /* <h1 data-tina-field={tinaField(data, 'title')}>{data.docs.title}</h1>
        <p data-tina-field={tinaField(data, 'intro')}>{data.docs.intro}</p>
        <div data-tina-field={tinaField(data, 'body')}>
          <TinaMarkdown components={components} content={data.docs.body} />
        </div> */
        }
        <h1>{data.docs.title}</h1>
        <p>{data.docs.intro}</p>
        <div>
          <TinaMarkdown components={components} content={data.docs.body} />
        </div>
        
      </DocLayout>
    );
  } else {
    return <Page404 />;
  }
}
export default DocPage;

export const getStaticProps = async ({ params, preview, previewData }) => {
  const { data, query, variables } = await client.queries.documentQuery(
    {
      relativePath: `${params.filename}.mdx`,
    },
    {
      branch: preview && previewData?.branch,
    }
  );
  return {
    props: {
      variables,
      data,
      query,
    },
  };
};

export const getStaticPaths = async () => {
  const docsListData = await client.queries.docsConnection({});

  return {
    paths:
      docsListData?.docsConnection?.edges?.map((doc) => ({
        params: { filename: doc.node._sys.filename },
      })) || [],
    fallback: "blocking",
  };
};
