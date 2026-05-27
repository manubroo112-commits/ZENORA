import react from "@vitejs/plugin-react";
import { config as loadEnvFile } from "dotenv";
import { defineConfig } from "vite";
import studyAssistant from "./api/study-assistant.js";
import studyPlanner from "./api/study-planner.js";

loadEnvFile({ path: ".env.local", override: false, quiet: true });
loadEnvFile({ override: false, quiet: true });

const apiRoutes = {
  "/api/study-assistant": studyAssistant,
  "/api/study-planner": studyPlanner
};

function createVercelLikeResponse(res) {
  return {
    status(code) {
      res.statusCode = code;
      return this;
    },
    json(payload) {
      if (!res.headersSent) {
        res.setHeader("Content-Type", "application/json");
      }
      res.end(JSON.stringify(payload));
    }
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    req.on("data", (chunk) => {
      rawBody += chunk;
    });

    req.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}

function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url?.split("?")[0];
        const handler = apiRoutes[pathname];

        if (!handler) {
          next();
          return;
        }

        try {
          req.body = await readJsonBody(req);
          await handler(req, createVercelLikeResponse(res));
        } catch (error) {
          console.error(`Local API error for ${pathname}:`, error);

          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
          }

          res.end(JSON.stringify({ error: "Local API request failed." }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()]
});
