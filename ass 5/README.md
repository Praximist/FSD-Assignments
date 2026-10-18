# Fieldnotes Product Catalog

A responsive product catalog with an Express REST API, MongoDB persistence, and a separate admin collection studio. The storefront is served from the same Node.js app as the API.

## Requirements

- Node.js 18 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

## Run locally

1. Open a terminal in `ass 5` and install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env`. Set `MONGODB_URI` to your local MongoDB URL or Atlas connection string.

3. Optionally add the sample products:

   ```sh
   npm run seed
   ```

   The seed command only inserts sample records when the collection is empty.

4. Start the app:

   ```sh
   npm run dev
   ```

5. Open `http://localhost:3000` for the catalog or `http://localhost:3000/admin` for product management.

## REST API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Add a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Remove a product |
| GET | `/api/health` | Check server and database status |

Products have a name, category, description, price, image URL, and featured flag. Mongoose validates each record before it is stored. Product images are referenced by URL; image files are not uploaded to MongoDB.

## Deploy

Deploy this Node.js project to a Node-compatible host such as Render, Railway, or a VPS. Set `MONGODB_URI` and (if needed) `PORT` in the host's environment variables, use `npm install` for the build/install command, and `npm start` to launch. In MongoDB Atlas, allow network access from the deployment host and create a database user with access to the app database. Do not commit `.env` or expose the database URI in browser code.

The admin page is intentionally a coursework CRUD panel and does not include authentication. Add authentication and authorization before exposing it on a public production deployment.