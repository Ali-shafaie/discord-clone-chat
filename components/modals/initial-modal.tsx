"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { FileUpload } from "../file-upload";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

// ... (other imports)

const formSchema = z.object({
  name: z.string().min(3, { message: "Server name is required." }),
  imageUrl: z.string().min(3, { message: "Server image is required." }),
});

export function InitialModal() {
  const [isClient, setClient] = useState(false);
  const route = useRouter();

  useEffect(() => {
    setClient(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "", // Corrected
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: any) => {
    console.log(values);
    try {
      await axios.post("/api/server", values);
      form.reset();
      // Use route.reload() instead of window.location.reload()
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  if (!isClient) {
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
                    name="imageUrl"
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
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server name
                      </FormLabel>
                      <FormControl>
                        <Input
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible::ring-0 text-black focus-visible:ring-offset-0"
                          placeholder="Enter server name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="error" />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button type="submit" disabled={isLoading} variant={"primary"}>
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
