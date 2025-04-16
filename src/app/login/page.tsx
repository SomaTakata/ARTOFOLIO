"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";

const schema = z.object({
  terms: z.literal(true, {
    errorMap: () => ({
      message: "You must agree to the terms and conditions.",
    }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const onSubmit = () => {
    signIn();
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 items-center">
        <Button
          type="submit"
          size="lg"
          variant="outline"
          disabled={!isValid}
          className="cursor-pointer"
        >
          Sign In With Google
        </Button>

        <div className="flex items-center">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="terms"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
            )}
          />
          <Label htmlFor="terms" className="ml-2">
            Agree to <Link href="/" className="cursor-pointer underline">Terms and Conditions</Link>
          </Label>
        </div>

        {errors.terms && (
          <p className="text-red-500 text-sm">
            {errors.terms.message}
          </p>
        )}
      </form>
    </div>
  );
}
