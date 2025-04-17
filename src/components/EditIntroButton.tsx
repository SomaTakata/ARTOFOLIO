"use client"
import { Html, Text, RoundedBox, useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { SCALE, wallYPosition } from "./Room";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IntroInputSchema } from "@/server/models/user.schema";
import * as THREE from "three";
import { z } from "zod";

export default function EditIntroButton({ currentIntro }: { currentIntro: string }) {
  const [showPopup, setShowPopup] = useState(false);
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  useCursor(hovered, "pointer", "auto");

  const form = useForm<z.infer<typeof IntroInputSchema>>({
    resolver: zodResolver(IntroInputSchema),
    defaultValues: { intro: currentIntro },
  });
  const { handleSubmit, control, formState } = form;

  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const current = groupRef.current.scale.x;
      const target = hovered ? 1.05 : 1.0;
      const next = THREE.MathUtils.lerp(current, target, delta * 10);
      groupRef.current.scale.set(next, next, next);
    }
  });

  const onSubmit = async (data: z.infer<typeof IntroInputSchema>) => {
    await fetch("/api/profile/intro", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intro: data.intro }),
    });
    router.refresh();
    setShowPopup(false);
  };

  return (
    <group
      ref={groupRef}
      position={[30, wallYPosition * SCALE + 10, 60 * SCALE - 0.3]}
      rotation={[0, -Math.PI, 0]}
    >
      {/* ——— Glossy Black Rounded Button ——— */}
      <RoundedBox
        args={[12, 2.5, 0.5]}
        radius={0.4}
        smoothness={4}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setShowPopup(true)}
        castShadow
      >
        <meshStandardMaterial
          color="#000000"
          metalness={1.0}
          roughness={0.05}
        />
      </RoundedBox>

      <Text
        position={[0, 0, 0.3]}
        fontSize={1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontWeight={700}
      >
        UPDATE
      </Text>

      {/* ——— Dialog aligned above button ——— */}
      {showPopup && (
        <Html transform center position={[0, 4, 0]}>
          <Dialog open onOpenChange={setShowPopup}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()}>
              <DialogTitle>Who's you?</DialogTitle>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={control}
                    name="intro"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="I'm a software engineer..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a simple self‑introduction in 40 characters or less.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={formState.isSubmitting}
                    className={`
                      w-full cursor-pointer
                      ${formState.isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
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
