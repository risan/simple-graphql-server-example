require('dotenv').config();
const { GraphQLServer } = require('graphql-yoga');
const uniqid = require('uniqid');

const posts = [
  {
    id: uniqid(),
    url: 'https://graphql.org',
    description: 'The official GraphQL website.'
  },
  {
    id: uniqid(),
    url: 'https://www.howtographql.com',
    description: 'Awesome GraphQL tutorial.'
  },
  {
    id: uniqid(),
    url: 'https://github.com/graphcool/graphql-yoga',
    description: 'Fully-featured GraphQL server for JavaScript'
  },
  {
    id: uniqid(),
    url: 'https://risan.io',
    description: "Risan's programming blog."
  }
];

const findPostIdxById = id => {
  let postIdx = null;

  for (let idx = 0; idx < posts.length; idx += 1) {
    if (posts[idx].id === id) {
      postIdx = idx;
      break;
    }
  }

  return postIdx;
};

const resolvers = {
  Query: {
    info: () => 'A simple GraphQL server example with in-memory data.',
    posts: () => posts
  },

  Mutation: {
    createPost: (root, { url, description }) => {
      const post = {
        id: uniqid(),
        url,
        description
      };

      posts.push(post);

      return post;
    },

    updatePost: (root, { id, url, description }) => {
      const postIdx = findPostIdxById(id);

      if (postIdx === null) {
        return null;
      }

      posts[postIdx] = { ...posts[postIdx], url, description };

      return posts[postIdx];
    },

    deletePost: (root, { id }) => {
      const postIdx = findPostIdxById(id);

      if (postIdx === null) {
        return null;
      }

      const post = posts[postIdx];

      posts.splice(postIdx, 1);

      return post;
    }
  },

  Post: {
    id: root => root.id,
    url: root => root.url,
    description: root => root.description
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start(
  {
    port:
      (process.env.PORT ? parseInt(process.env.PORT, 10) : undefined) || 4000
  },
  ({ port }) => console.log(`🏃🏻‍ Server is running on port ${port}.`)
);
