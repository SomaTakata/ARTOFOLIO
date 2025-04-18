import { OpenAPIHono } from "@hono/zod-openapi";
import { checkUsernameHandler, getPortofolioHandler, getUsernameHandler, setUsernameHandler, updateIntroHandler, updateLinksHandler, updateSkillsHandler, updateWorksHandler } from "./controllers/user.controller";
import { checkUsernameRoute, getPortofolioRoute, getUsernameRoute, setUsernameRoute, updateIntroRoute, updateLinksRoute, updateSkillsRoute, updateWorksRoute } from "./routes/user.route";
import { swaggerUI } from "@hono/swagger-ui";
import { basicAuth } from "hono/basic-auth";
import { env } from "@/env.mjs";

export const app = new OpenAPIHono().basePath("/api");

const userApp = new OpenAPIHono()
  .openapi(getUsernameRoute, getUsernameHandler)
  .openapi(setUsernameRoute, setUsernameHandler)

const checkUserApp = new OpenAPIHono()
  .openapi(checkUsernameRoute, checkUsernameHandler)

const profileApp = new OpenAPIHono()
  .openapi(updateIntroRoute, updateIntroHandler)
  .openapi(updateSkillsRoute, updateSkillsHandler)
  .openapi(updateWorksRoute, updateWorksHandler)
  .openapi(updateLinksRoute, updateLinksHandler)
  .openapi(getPortofolioRoute, getPortofolioHandler)

const mainApp = new OpenAPIHono()
  .route("/me/username", userApp)
  .route("/username/check", checkUserApp)
  .route("/profile", profileApp)

app.route("/", mainApp);

app.doc("/specification", {
  openapi: "3.0.0",
  info: { title: "RESUME GALLARY API", version: "1.0.0" },
}).use('/doc/*', async (c, next) => {
  const auth = basicAuth({
    username: env.API_DOC_BASIC_AUTH_USER,
    password: env.API_DOC_BASIC_AUTH_PASS,
  });
  return auth(c, next);
}).get("/doc", swaggerUI({ url: "/api/specification" }));

export default app;
