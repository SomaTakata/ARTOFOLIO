import { OpenAPIHono } from "@hono/zod-openapi";
import { getUsernameHandler, setUsernameHandler } from "./controllers/user.controller";
import { getUsernameRoute, setUsernameRoute } from "./routes/user.route";
import { swaggerUI } from "@hono/swagger-ui";

export const app = new OpenAPIHono().basePath("/api");

const userApp = new OpenAPIHono()
  .openapi(getUsernameRoute, getUsernameHandler)
  .openapi(setUsernameRoute, setUsernameHandler)

const mainApp = new OpenAPIHono()
  .route("/me", userApp)

const route = app.route("/", mainApp);

app.doc("/specification", {
  openapi: "3.0.0",
  info: { title: "RESUME GALLARY API", version: "1.0.0" },
});

app.get("/doc", swaggerUI({ url: "/api/specification" }));

export type AppType = typeof route;
export default app;
