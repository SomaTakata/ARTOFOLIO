import { createRoute, z } from "@hono/zod-openapi";
import { IntroInputSchema, portofolioSchema, SkillsSchema, SnsSchema, UpdateWorkPayloadSchema, UserCheckQuerySchema, UsernameInputSchema, UsernameSchema } from "../models/user.schema";
import { ErrorSchema } from "../models/error.schema";

export const getUsernameRoute = createRoute({
  path: "/",
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
  path: "/",
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
    409: {
      description: "ユーザー名がすでに使用されています",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})

export const checkUsernameRoute = createRoute({
  path: "/",
  method: "get",
  description: "ユーザー名の重複チェック",
  request: {
    query: UserCheckQuerySchema
  },
  responses: {
    200: {
      description: "取得成功",
      content: {
        "application/json": {
          schema: z.object({
            available: z.boolean()
          })
        }
      }
    },
  }
})

export const getPortofolioRoute = createRoute({
  path: "/{username}",
  method: "get",
  description: "ユーザー情報の取得",
  request: {
    params: z.object({
      username: z.string()
    })
  },
  responses: {
    200: {
      description: "取得成功",
      content: {
        "application/json": {
          schema: portofolioSchema
        }
      }
    },
    404: {
      description: "ユーザーが見つかりません",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})

export const updateIntroRoute = createRoute({
  path: "/intro",
  method: "put",
  description: "自己紹介の更新",
  request: {
    body: {
      content: {
        "application/json": {
          schema: IntroInputSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "更新成功",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string()
          })
        }
      }
    },
    400: {
      description: "自己紹介が未入力",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})

export const updateSkillsRoute = createRoute({
  path: "/skills",
  method: "put",
  description: "スキルの更新",
  request: {
    body: {
      content: {
        "application/json": {
          schema: SkillsSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: "更新成功",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string()
          })
        }
      }
    },
    400: {
      description: "スキルが未入力",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})

export const updateWorksRoute = createRoute({
  path: "/works",
  method: "put",
  description: "作品の更新（画像アップロード対応）",
  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: UpdateWorkPayloadSchema, // UpdateWorkPayloadSchema は以下のように定義
        },
      },
    },
  },
  responses: {
    200: {
      description: "更新成功",
      content: {
        "application/json": {
          schema:
            z.object({
              message: z.string(),
            }),
        },
      },
    },
    400: {
      description: "入力エラー（作品が未入力など）",
      content: {
        "application/json": { schema: ErrorSchema },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": { schema: ErrorSchema },
      },
    },
    404: {
      description: "User not found",
      content: {
        "application/json": { schema: ErrorSchema },
      },
    },
    500: {
      description: "サーバー内部エラー",
      content: {
        "application/json": { schema: ErrorSchema },
      },
    },
  },
});


export const updateLinksRoute = createRoute({
  path: "/links",
  method: "put",
  description: "リンクの更新",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            sns: SnsSchema
          })
        }
      }
    }
  },
  responses: {
    200: {
      description: "更新成功",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string()
          })
        }
      }
    },
    400: {
      description: "snsが未入力",
      content: {
        "application/json": {
          schema: ErrorSchema
        }
      }
    }
  }
})
