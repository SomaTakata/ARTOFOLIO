"use client";
import { Html, Text, RoundedBox, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { SCALE, wallYPosition } from "./Room";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import * as THREE from "three";
import {
  UpdateWorkPayloadSchema,
  UpdateWorkPayloadSchemaType,
} from "@/server/models/user.schema";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";

type Props = {
  title: string;
  desc: string;
  siteUrl: string;
  workIndex: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
};

export default function EditWorksButton({
  title,
  desc,
  siteUrl,
  workIndex,
  position,
  rotation,
}: Props) {
  const [showPopup, setShowPopup] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  // useForm と formState の取得
  const form = useForm<UpdateWorkPayloadSchemaType>({
    resolver: zodResolver(UpdateWorkPayloadSchema),
    defaultValues: { title, desc, siteUrl, index: workIndex },
  });
  const { handleSubmit, control, formState } = form;

  // 3D ボタンのスムーズなホバー拡大用
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) {
      const current = groupRef.current.scale.x;
      const target = hovered ? 1.05 : 1.0;
      const next = THREE.MathUtils.lerp(current, target, delta * 10);
      groupRef.current.scale.set(next, next, next);
    }
  });

  // Drei hook でホバー時カーソルをポインターに
  useCursor(hovered, "pointer", "auto");

  const onSubmit = async (data: UpdateWorkPayloadSchemaType) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("siteUrl", data.siteUrl);
    formData.append("index", data.index);

    if (data.image && data.image.length > 0) {
      const file = data.image[0];
      const arrayBuffer = await file.arrayBuffer();
      formData.append("image", new Blob([arrayBuffer], { type: file.type }), file.name);
    }

    await axios.put("/api/profile/works", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.refresh();
    setShowPopup(false);
  };

  return (
    <group>
      {/* 3D ボタン */}
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
      >
        <RoundedBox
          args={[15, 3, 0.5]}
          radius={0.4}
          smoothness={4}
          castShadow
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setShowPopup(true)}
        >
          <meshStandardMaterial
            color="white"
            metalness={1.0}
            roughness={0.05}
          />
        </RoundedBox>
        <Text
          position={[0, 0, 0.3]}
          fontSize={1.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          Update
        </Text>
      </group>

      {/* フォームダイアログ */}
      {showPopup && (
        <Html transform center position={[15 + 20, wallYPosition * SCALE, 60 * SCALE - 0.3]} rotation={[0, -Math.PI, 0]}>
          <Dialog open onOpenChange={setShowPopup}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogTitle>Please register your work.</DialogTitle>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  {/* Title */}
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="title" {...field} className="w-full" />
                        </FormControl>
                        <FormDescription>
                          Please write the title within 20 characters.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Description */}
                  <FormField
                    control={control}
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
                  {/* Site URL */}
                  <FormField
                    control={control}
                    name="siteUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site URL</FormLabel>
                        <FormControl>
                          <Input type="url" placeholder="https://example.com" {...field} className="w-full" />
                        </FormControl>
                        <FormDescription>
                          It&apos;s fine to leave this blank if there is no URL.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Image Upload */}
                  <FormItem>
                    <FormLabel>Picture</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        aria-label="Choose an image file"
                        onChange={(e) => form.setValue("image", e.target.files!)}
                      />
                    </FormControl>
                  </FormItem>
                  {/* Hidden index */}
                  <Input type="hidden" {...form.register("index")} />
                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className={`
                      w-full
                      bg-black text-white
                      cursor-pointer
                      rounded-md
                      transform transition-transform duration-200
                      ${formState.isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                      }
                    `}
                  >
                    {formState.isSubmitting ? "Sending..." : "Update"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </Html>
      )}
    </group>
  );
}
