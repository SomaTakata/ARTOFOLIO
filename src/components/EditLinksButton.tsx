"use client";
import { Html, Text } from "@react-three/drei";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ProfileWithTypedSkills,
  SkillType,
  SnsSchemaType,
} from "@/server/models/user.schema";
import Painting from "./Painting";
import { Input } from "./ui/input";
import { ClickableLink } from "./ClickableLink";

export const techs = [
  "React",
  "Vue",
  "Auth.js",
  "Tailwind",
  "Supabase",
] as const;

type SNSField = "qiita" | "zenn" | "github" | "twitter" | "otherwise";

type Props = {
  skills: SkillType[];
  editNum: number;
  portofolio: ProfileWithTypedSkills;
  color?: string;
  textColor?: string;
  framePosition?: [number, number, number];
  frameRotation?: [number, number, number];
  picturePosition?: [number, number, number];
  pictureRotation?: [number, number, number];
  currentSNS: SnsSchemaType,
  fieldName: SNSField,
  pictureUrl: string
};

export default function EditLinksButton({
  color = "black",
  textColor = "white",
  framePosition = [
    -45 * SCALE + 0.5,
    wallYPosition * SCALE,
    120 - 26 - 24 - 23 - 24 - 23 - 12,
  ],
  frameRotation = [0, Math.PI * 0.5, 0],
  picturePosition = [
    -45 * SCALE + 1.1,
    wallYPosition * SCALE,
    120 - 26 - 24 - 23 - 24 - 23 - 12,
  ],
  pictureRotation = [0, Math.PI * 0.5, 0],
  currentSNS,
  fieldName,
  pictureUrl,
  portofolio
}: Props) {

  const SingleLinkSchema = z.object({
    link: z.string().url().or(z.literal("")).refine((val) => {
      if (!val) return true; // 空ならOK（nullable扱い）

      switch (fieldName) {
        case "github":
          return val.startsWith("https://github.com/");
        case "twitter":
          return val.startsWith("https://twitter.com/");
        case "zenn":
          return val.startsWith("https://zenn.dev/");
        case "qiita":
          return val.startsWith("https://qiita.com/");
        default:
          return true;
      }
    }, {
      message: `${fieldName} link format is incorrect.`,
    }),
  });

  type SingleLinkFormData = z.infer<typeof SingleLinkSchema>;
  const [showPopup, setShowPopup] = useState(false);
  const form = useForm<SingleLinkFormData>({
    resolver: zodResolver(SingleLinkSchema),
    defaultValues: {
      link: portofolio.sns[fieldName]
    },
  });

  const router = useRouter();

  const onSubmit = async (data: SingleLinkFormData) => {
    const updatedSNS: SnsSchemaType = { ...currentSNS, [fieldName]: data.link };

    console.log(updatedSNS)
    console.log(currentSNS)
    try {
      const res = await fetch("/api/profile/links", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sns: updatedSNS
        }),
      });
      if (!res.ok) {
        console.error(`Failed to update ${fieldName}`);
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(`Error updating ${fieldName}:`, error);
    }
  };


  return (
    <group>
        {(portofolio.editable || portofolio.sns[fieldName] !== "") && ( <mesh
        castShadow
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <Painting
          pictureUrl={pictureUrl}
          framePostion={framePosition}
          frameRotation={frameRotation}
          picturePosition={picturePosition}
          pictureRotation={pictureRotation}
          frameColor={color}
        />
      </mesh>)}

      {(portofolio.editable || portofolio.sns[fieldName] !== "") && (<group
        position={[framePosition[0], framePosition[1] - 15, framePosition[2]]}
        rotation={frameRotation}
      >
        <mesh>
          <planeGeometry args={[15, 3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <ClickableLink
          position={[0, 0, 0]}
          url={portofolio.sns[fieldName]}
        >
          <Text
            position={[0, 0, 0.1]}
            fontSize={1.2}
            color={textColor}
            anchorX="center"
            anchorY="middle"
            fontWeight={700}
          >
            {portofolio.sns[fieldName] && "🔗"}{fieldName}

          </Text>
        </ClickableLink>
      </group>)}

      <Html>
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogTitle>Link</DialogTitle>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldName} url</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder={`https://${fieldName}.com`} className="input-class" />
                      </FormControl>
                      <FormDescription>
                        If left blank, the link will not be set.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Update</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </Html>
    </group >
  );
}
