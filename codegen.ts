import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://exp.host/--/graphql',
  documents: './graphql/**/*.gql',
  generates: {
    './generated/graphql.tsx': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        skipTypename: false,
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
    './generated/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
