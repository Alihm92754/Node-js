const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    enum FactCategories {
        HISTORY 
        SCIENCE 
        ART 
        SPORTS 
        TECHNOLOGY 
        OTHER
    }

    type User {
        _id: ID!
        email: String!
    }

    type Fact {
        _id: ID!
        user: ID!
        content: String!
        upvotes: [Vote!]!
        downvotes: [Vote!]!
        upvoteCount: Int!
        downvoteCount: Int!
        category: FactCategories!
    }

    type Vote {
        _id: ID!
        user: ID!
        fact: Fact!
        isUpvote: Boolean!
    }

    type AuthResult {
        jwt: String!
    }

    input VoteInput {
        factId: ID! 
        isUpvote: Boolean
    }

    type Query {
        getFacts: [Fact!]!
        getFactsByCategory(category: FactCategories!): [Fact!]!
    }

    type Mutation {
        createFact(content: String!, category: FactCategories!): Fact!
        authenticate(email: String!): AuthResult!
        vote(input: VoteInput): Fact!
        deleteFact(factId: ID!): Boolean!
    }

    schema {
        query: Query
        mutation: Mutation
    }
`);
