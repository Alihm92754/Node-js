const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP, getGraphQLParams } = require("express-graphql");
const schema = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const jwt = require("jsonwebtoken");

const app = express();

app.all(
  "/graphql/",
  graphqlHTTP((req, res, params) => {
    console.log(params);
    let payload;

    const isAuthenticateQuery =
      params?.query?.includes("authenticate") || !params.operationName;

    if (!isAuthenticateQuery) {
      const token = req.headers["authorization"]?.split(" ")[1];
      if (!token) {
        throw new Error("unauthorized");
      }

      try {
        payload = jwt.verify(token, "JWT_SECRET");
        if (!payload) throw new Error();
      } catch (err) {
        throw new Error("unauthorized");
      }
    }

    return {
      schema,
      rootValue: resolvers,
      context: {
        req,
        payload,
      },
      graphiql: true,
    };
  })
);

mongoose
  .connect(
    "mongodb+srv://AliHm:778899@nodeexpressprojects.xjjbzzg.mongodb.net/factranker?retryWrites=true&w=majority&appName=NodeExpressProjects"
  )
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is up and running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
    throw new Error("Database connection failed!");
  });
