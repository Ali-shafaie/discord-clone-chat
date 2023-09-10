"use client";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUpload } from "../file-upload";
const formSchema = z.object({
  name: z.string().min(3, { message: "Server name is required." }),
  imageUrl: z.string().min(3, { message: "Server image is required." }),
});

export function InitialModal() {
  const [isClent, setClient] = useState(false);

  useEffect(() => {
    setClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ImageUrl: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit: any = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  if (!isClent) {
    return null;
  }

  return (
    <div>
      <UserButton />
      <Dialog open>
        <DialogContent className="sm:max-w-[425px] bg-white text-black p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl pt-8 font-bold">
              Customize your server
            </DialogTitle>
            <DialogDescription className="text-center px-8 text-zinc-500 ">
              Make changes to your profile here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex items-center justify-center text-center">
                  <FormField
                    control={form.control}
                    name="ImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}></FormField>
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase te xt-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className=" bg-zinc-300/50 border-0 focus-visible::ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="error" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-gary-100 px-6 py-4">
                <Button disabled={isLoading} variant={"primary"}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
