import { RouteHandler } from "@hono/zod-openapi";
import { checkUsernameRoute, getPortofolioRoute, getUsernameRoute, setUsernameRoute, updateIntroRoute, updateSkillsRoute, updateWorksRoute } from "../routes/user.route";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { supabase } from "@/lib/supabase";
import { UpdateWorkPayloadSchema, WorkType } from "../models/user.schema";

export const getUsernameHandler: RouteHandler<typeof getUsernameRoute> = async (c) => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const result = await db
    .select({
      username: user.username,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1);

  if (result.length === 0 || !result[0].username) {
    return c.json({ error: "Not Found" }, 404);
  }

  return c.json({ username: result[0].username }, 200);
}

export const setUsernameHandler: RouteHandler<typeof setUsernameRoute> = async (c) => {
  const { username } = c.req.valid("json");

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    throw Error("Unauthorized");
  }

  const userId = session.user.id;

  if (!username) {
    return c.json({ error: "ユーザー名を入力してください" }, 400);
  }

  const existing = await db
    .select()
    .from(user)
    .where(and(eq(user.username, username), ne(user.id, userId)))
    .limit(1);

  if (existing.length > 0) {
    return c.json({ error: "このユーザー名はすでに使用されています" }, 409);
  }

  await db
    .update(user)
    .set({ username })
    .where(eq(user.id, userId));

  return c.json({ username: username }, 201);
}

export const checkUsernameHandler: RouteHandler<typeof checkUsernameRoute> = async (c) => {
  const { username } = c.req.query()

  if (!username) {
    return c.json({ available: false });
  }

  const result = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .limit(1);

  const isAvailable = result.length === 0;

  return c.json({ available: isAvailable }, 200);
}

export const getPortofolioHandler: RouteHandler<typeof getPortofolioRoute> = async (c) => {
  const { username } = c.req.param();

  const result = await db
    .select()
    .from(user)
    .where(eq(user.username, username))
    .limit(1);

  if (result.length === 0) {
    return c.json({ error: "Not Found" }, 404);
  }

  const {
    name,
    username: uname,
    intro,
    skills,
    twitter,
    github,
    zenn,
    qiita,
  } = result[0];

  return c.json(
    {
      name,
      username: uname,
      intro,
      skills,
      twitter,
      github,
      zenn,
      qiita,
    }, 200);
};

export const updateIntroHandler: RouteHandler<typeof updateIntroRoute> = async (c) => {
  const { intro } = c.req.valid("json");

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    throw Error("Unauthorized");
  }

  const userId = session.user.id;

  if (!intro) {
    return c.json({ error: "自己紹介を入力してください" }, 400);
  }

  await db
    .update(user)
    .set({ intro })
    .where(eq(user.id, userId));

  return c.json({ message: "成功" }, 200);
}

export const updateSkillsHandler: RouteHandler<typeof updateSkillsRoute> = async (c) => {
  const { skills } = c.req.valid("json");

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session || !session.user?.id) {
    throw Error("Unauthorized");
  }

  const userId = session.user.id;

  if (!skills) {
    return c.json({ error: "スキルを入力してください" }, 400);
  }

  await db
    .update(user)
    .set({ skills })
    .where(eq(user.id, userId));

  return c.json({ message: "成功" }, 200);
}

export const updateWorksHandler: RouteHandler<typeof updateWorksRoute> = async (c) => {
  try {
    // multipart/form-data を受け取る
    const formData = await c.req.formData();

    // ファイル以外のフィールドの取り出しと検証
    const title = formData.get("title") as string;
    const desc = formData.get("desc") as string;
    const siteUrl = formData.get("siteUrl") as string;
    const indexStr = formData.get("index") as string;
    const index = Number(indexStr);
    if (isNaN(index)) {
      return c.json({ error: "無効な index です" }, 400);
    }

    // 画像ファイルの取得（存在していればアップロード）
    const file = formData.get("image");
    let publicUrl = "";
    if (file && file instanceof File) {
      const extension = file.type.split("/")[1];
      const filename = `works/${crypto.randomUUID()}.${extension}`;
      const { error } = await supabase.storage
        .from("works")
        .upload(filename, file.stream(), {
          contentType: file.type,
          upsert: true,
        });
      if (error) {
        console.error("Upload error:", error);
        return c.json({ error: "画像のアップロードに失敗しました" }, 500);
      }
      publicUrl = supabase.storage
        .from("works")
        .getPublicUrl(filename)
        .data.publicUrl;
    }

    // セッションチェック
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session || !session.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    const userId = session.user.id;

    // 現在の works 配列を DB から取得
    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, userId),
    });
    if (!currentUser) {
      return c.json({ error: "User not found" }, 404);
    }

    const currentWorks = currentUser.works as WorkType[];
    if (index < 0 || index >= currentWorks.length) {
      return c.json({ error: "無効な index です" }, 400);
    }

    // 該当作品を更新（画像がアップロードされていれば pictureUrl も更新）
    const updatedWorks = [...currentWorks];
    updatedWorks[index] = {
      ...updatedWorks[index],
      title,
      desc,
      siteUrl,
      ...(publicUrl && { pictureUrl: publicUrl }),
    };

    await db.update(user)
      .set({ works: updatedWorks })
      .where(eq(user.id, userId));

    return c.json({ message: "更新成功" }, 200);
  } catch (err) {
    console.error("Error updating works:", err);
    return c.json({ error: "サーバー内部エラー" }, 500);
  }
};

