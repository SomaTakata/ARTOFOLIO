import { createRoute, z } from "@hono/zod-openapi";
import { UsernameInputSchema, UsernameSchema } from "../models/user.schema";
import { ErrorSchema } from "../models/error.schema";

export const getUsernameRoute = createRoute({
  path: "/username",
  method: "get",
  description: "ユーザー名の取得",
  responses: {
    200: {
      description: "取得成功",
      content: {
        "application/json": {
          schema: UsernameSchema
        }
      }
    },
    404: {
      description: "値がありません",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})

export const setUsernameRoute = createRoute({
  path: "/username",
  method: "post",
  description: "ユーザー名の設定",
  request: {
    body: {
      content: {
        "application/json": {
          schema: UsernameInputSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: "設定成功",
      content: {
        "application/json": {
          schema: UsernameSchema
        }
      }
    },
    400: {
      description: "ユーザー名が未入力",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    },
    409:{
      description: "ユーザー名がすでに使用されています",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})
