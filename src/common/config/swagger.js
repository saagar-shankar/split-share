import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Split Share API",
      version: "1.0.0",
      description:
        "A backend API for managing groups, expenses, and settlements. Users can create groups, add members, record shared expenses, and settle outstanding dues.",
    },
    tags: [
      {
        name: "Authentication",
        description: "User authentication and account management",
      },
      {
        name: "Groups",
        description: "Group management operations",
      },
      {
        name: "Expenses",
        description: "Expense tracking and settlement operations",
      },
    ],
    servers: [
      // use this part for testing locally
      // {
      //   url: "http://localhost:4000",
      //   description: "Development Server",
      // },
      {
        url: "https://split-share-898m.onrender.com",
        description: "Production Server",
      },
    ],
  },
  //this line means to search for swagger comments inside src folder
  apis: ["./src/module/**/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
