"use client"
import { Html, Text } from "@react-three/drei";
import { SCALE, wallYPosition } from "./Room";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileWithTypedSkills,
  UpdateWorkPayloadSchema,
  UpdateWorkPayloadSchemaType
} from "@/server/models/user.schema";
import { ClickableLink } from "./ClickableLink";

type Props = {
  title: string;
  desc: string;
  siteUrl: string;
  workIndex: string;
  position?: [number, number, number],
  rotation?: [number, number, number],
  portofolio: ProfileWithTypedSkills
};

export default function EditWorksButton({
  title, desc, siteUrl, workIndex,
  position, rotation, portofolio
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const form = useForm<UpdateWorkPayloadSchemaType>({
    resolver: zodResolver(UpdateWorkPayloadSchema),
    defaultValues: {
      title: title,
      desc: desc,
      siteUrl: siteUrl,
      index: workIndex,
    },
  });

  const onSubmit = async (data: UpdateWorkPayloadSchemaType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("siteUrl", data.siteUrl);
    formData.append("index", data.index);

    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: file.type });
      formData.append("image", blob, file.name);
    }

    try {
      const res = await axios.put("/api/profile/works", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        router.refresh();
      } else {
        console.error("Failed to update work");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <group>
      <group
        position={position}
        rotation={rotation}
      >
        <mesh onClick={() => setShowPopup(true)} castShadow>
          <planeGeometry args={[15, 3]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={1.2}
          fontWeight={700}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          Update
        </Text>
      </group>
      <Html
        position={[15 + 20, wallYPosition * SCALE, 60 * SCALE - 0.3]}
        rotation={[0, -Math.PI, 0]}
      >
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogTitle>Please register your work.</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Textarea placeholder="title" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please write the title within 20 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="description" {...field} />
                      </FormControl>
                      <FormDescription>
                        Please write the description within 100 characters.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="siteUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Site URL</FormLabel>
                      <FormControl>
                        <Textarea placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        It's okay if your work doesn't have a URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* ファイル入力 */}
                <FormItem>
                  <FormLabel>Pitcture</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        form.setValue("image", e.target.files!);
                      }}
                    />
                  </FormControl>
                </FormItem>
                {/* 更新対象 index を hidden に */}
                <input type="hidden" {...form.register("index")} />
                <Button type="submit" className="w-full">
                  Update
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </Html>
    </group>
  );
}
