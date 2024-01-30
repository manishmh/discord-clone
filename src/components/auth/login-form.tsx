"use client";

import { login } from "@/actions/login";
import Socials from "@/components/auth/socials";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginSchema } from "@/schemas/input-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";
import * as z from "zod";

const LoginForm = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const searchParam = useSearchParams();
  const urlError =
    searchParam.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      try {
        const data = await login(values);
        const { success, message } = data;

        if (!success) {
          toast({ title: "Failed", description: message });
          console.error(message);
        } else if (success) {
          toast({ title: "success", description: message });
          form.reset();
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Something went wrong! try again",
        });
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center sm:h-screen sm:bg-[#5865F2]">
      <div
        className={`flex flex-col gap-3 items-center justify-center px-2 w-full sm:max-w-lg rounded-lg sm:bg-[#313338] py-12 sm:py-8 ${
          isPending ? "pointer-events-none opacity-80" : "pointer-events-auto"
        } `}
      >
        <h1 className="font-bold text-2xl">Welcome back!</h1>
        <h2 className="text-gray-400 font-medium">
          We&apos; so excited to see you again!
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full items-center max-w-md"
          >
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-300">
                      Email
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="manish@gmail.com"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-300">
                      Password
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                size={"sm"}
                variant={"link"}
                asChild
                className="px-0 font-normal"
              >
                <Link href={"/auth/reset"}>Forgot password?</Link>
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gray-200 w-full font-semibold text-black hover:bg-white transition-colors duration-300"
              >
                Login
              </Button>
            </div>
          </form>
        </Form>
        <div className="w-full max-w-md">
          <Socials disabled={isPending} />
        </div>
        <Button className="max-w-md" disabled={isPending}>
          <Link
            href={"/auth/register"}
            className="text-blue-500 mt-3 font-medium text-sm flex gap-1 self-start"
          >
            Need an account ?<span className="text-blue-500">Register</span>
          </Link>
        </Button>
        {urlError && (
          <div className="text-red-600 bg-red-200 mt-4 rounded-md py-3 px-4 flex gap-4 items-center text-sm">
            <FaExclamationTriangle />
            {urlError}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
