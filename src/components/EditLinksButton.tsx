"use client";
import { Html, Text } from "@react-three/drei";
import { SCALE, wallYPosition } from "./Room";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ProfileWithTypedSkills,
  SkillSchema,
  SkillType,
} from "@/server/models/user.schema";
import Painting from "./Painting";

export const techs = [
  "React",
  "Vue",
  "Auth.js",
  "Tailwind",
  "Supabase",
] as const;

type FormData = z.infer<typeof SkillSchema>;
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
};

export default function EditLinksButton({
  skills,
  editNum,
  portofolio,
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
}: Props) {
  const { name, level } = skills[editNum];

  const [showPopup, setShowPopup] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(SkillSchema),
    defaultValues: {
      name: name,
      level: level,
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const { name, level } = data;

    const updatedSkills = [...skills];

    updatedSkills[editNum] = {
      ...updatedSkills[editNum],
      name: name,
      level: level,
    };

    console.log(updatedSkills);

    await fetch(`/api/profile/skills`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skills: updatedSkills,
      }),
    });

    router.refresh();
  };

  return (
    <group>
      <mesh
        castShadow
        onClick={() => {
          setShowPopup(true);
        }}
      >
        <Painting
          pictureUrl={`${portofolio.skills[editNum].name}.png`}
          framePostion={framePosition}
          frameRotation={frameRotation}
          picturePosition={picturePosition}
          pictureRotation={pictureRotation}
          frameColor={color}
        />
      </mesh>

      <group
        position={[framePosition[0], framePosition[1] - 15, framePosition[2]]}
        rotation={frameRotation}
      >
        <mesh>
          <planeGeometry args={[15, 3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={1.2}
          color={textColor}
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          Lv.{portofolio.skills[editNum].level}{" "}
          {portofolio.skills[editNum].name}
        </Text>
      </group>

      <Html>
        <Dialog open={showPopup} onOpenChange={setShowPopup}>
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogTitle>Choose your favorite tech</DialogTitle>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tech Stack</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex"
                        >
                          {techs.map((tech) => (
                            <FormItem
                              key={tech}
                              className="flex items-center space-x-3"
                            >
                              <FormControl>
                                <RadioGroupItem value={tech} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {tech}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skill Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {["1", "2", "3", "4", "5"].map((lvl) => (
                            <FormItem
                              key={lvl}
                              className="flex items-center space-x-2"
                            >
                              <FormControl>
                                <RadioGroupItem value={lvl} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {lvl}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </Html>
    </group>
  );
}
