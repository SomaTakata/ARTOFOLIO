"use client"
import { Html, Text } from "@react-three/drei";
import { SCALE, wallYPosition } from "./Room";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IntroInputSchema } from "@/server/models/user.schema";

export default function EditIntroButton({ currentIntro }: {
  currentIntro: string;
}) {

  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof IntroInputSchema>>({
    resolver: zodResolver(IntroInputSchema),
    defaultValues: {
      intro: currentIntro,
    },
  })

  const onSubmit = async (data: z.infer<typeof IntroInputSchema>) => {

    const { intro } = data;

    await fetch("/api/profile/intro", {
      method: "PUT",
      body: JSON.stringify({ intro }),
      headers: {
        "Content-Type": "application/json",
      },
    })

    router.refresh()
  }

  return (
    <group>
      <group
        position={[15 + 15, wallYPosition * SCALE + 10, 60 * SCALE - 0.3]}
        rotation={[0, -Math.PI, 0]}
      >
        <mesh
          onClick={() => setShowPopup(true)}
          castShadow
        >
          <planeGeometry args={[10, 2]} />
          <meshStandardMaterial color="orange" />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={1.0}
          color="black"
          anchorX="center"
          anchorY="middle"
          fontWeight={700}
        >
          Update
        </Text>
      </group>

      <Html>
        <Dialog
          open={showPopup}
          onOpenChange={setShowPopup}
        >
          <DialogContent onInteractOutside={(e) => e.preventDefault()}>
            <DialogTitle>Who's you?</DialogTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
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
                        Write a simple self-introduction in 40 characters or less.
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
    </group>
  );
}
