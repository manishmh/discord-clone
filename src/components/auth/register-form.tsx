"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { registerSchema } from "@/schemas/input-validation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    const { email, password }  = values;
    try {
        const { email, password } = values;
        const res = await fetch("http://localhost:8080/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        console.log(data);

        if (data?.status == "success") {
          toast({ title: "Login Authentication", description: "user registered successfully"});
        } else if(data?.status === 'conflict') {
          toast({ title: "Login Failed", description: "user already exists"});
        }
      } catch (error) {
        toast({
          title: "Login Authentication",
          description: "User does not exist",
          duration: 2000,
        });
      } 
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center sm:h-screen sm:bg-[#5865F2]">
      <div className="flex flex-col gap-3 items-center justify-center px-2 w-full sm:max-w-lg rounded-lg sm:bg-[#313338] py-12 sm:py-8">
        <h1 className="font-bold text-2xl">Create an account</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-3 items-center max-w-md">
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
                    <FormMessage className="text-red-400 text-xs"/>
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
                    <FormMessage className="text-red-400 text-xs"/>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-gray-200 w-full font-semibold text-black"
              >
                Register
              </Button>
              <Link href={'/auth/login'}>
                <div className="text-blue-500 mt-3 font-medium text-sm flex gap-1 self-start">
                  Already have an account ?
                  <span className="text-blue-500">Login</span>
                </div>
              </Link>
            </div>
          </form>
        </Form> 
      </div>
    </div>
  );
};

export default RegisterForm;