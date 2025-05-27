"use client";

import * as React from "react";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../app/lib/contract";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/shared/card";
import { TrashIcon, PlusIcon } from "lucide-react";
import { Button } from "@/shared/Button";
import { Input } from "@/shared/input";

// ✅ Form schema
const formSchema = z.object({
  pollName: z.string().min(5, "Poll name must be at least 5 characters"),
  duration: z
    .number({ invalid_type_error: "Duration must be a number" })
    .min(1, "Duration must be at least 1 hour"),
  options: z
    .array(z.object({ text: z.string().min(1, "Option text is required") }))
    .min(2, "At least 2 options are required"),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePoll() {
  const router = useRouter();

  const {
    writeContractAsync,
    data: txHash,
    isError: isWriteError,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const [loading, setLoading] = React.useState(false);
  const [hasErrorToastShown, setHasErrorToastShown] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pollName: "",
      duration: 10,
      options: [{ text: "" }, { text: "" }],
    },
  });

  const { control, handleSubmit } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const handleTransactionError = (err: unknown) => {
    if (hasErrorToastShown) return;
    setHasErrorToastShown(true);

    if (err instanceof Error) {
      const msg =
        "shortMessage" in err
          ? (err as { shortMessage: string }).shortMessage
          : err.message;
      toast.error(`Transaction failed: ${msg}`);
    } else {
      toast.error("An unknown error occurred.");
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setHasErrorToastShown(false);

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: "createPoll",
        args: [
          data.pollName,
          data.options.map((opt) => opt.text),
          data.duration * 60 * 60, // Convert hours to seconds
        ],
      });
    } catch (err) {
      setLoading(false);
      toast.dismiss("tx-status");
      handleTransactionError(err);
    }
  };

  React.useEffect(() => {
    if (isConfirming) {
      toast.loading("Transaction pending...", { id: "tx-status" });
    }
  }, [isConfirming]);

  React.useEffect(() => {
    if (isConfirmed) {
      toast.success("Poll created successfully!", { id: "tx-status" });
      form.reset();
      setLoading(false);
    }
  }, [isConfirmed]);

  React.useEffect(() => {
    if (isWriteError && writeError) {
      setLoading(false);
      toast.dismiss("tx-status");
      handleTransactionError(writeError);
    }
  }, [isWriteError, writeError]);

  React.useEffect(() => {
    if (isReceiptError && receiptError) {
      setLoading(false);
      toast.dismiss("tx-status");
      handleTransactionError(receiptError);
    }
  }, [isReceiptError, receiptError]);

  return (
    <div className="w-full b px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        <Card className="shadow-md bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl font-semibold">
              Create a New Poll
            </CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4 sm:space-y-6">
                <FormField
                  control={control}
                  name="pollName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Poll Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full text-sm sm:text-base"
                          placeholder="Enter poll name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">
                        Duration (in hours)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="w-full text-sm sm:text-base"
                          placeholder="e.g. 1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel className="text-sm sm:text-base">
                    Poll Options
                  </FormLabel>
                  <div className="space-y-3 mt-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                    {fields.map((field, index) => (
                      <FormField
                        key={field.id}
                        control={control}
                        name={`options.${index}.text`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2 items-center">
                              <FormControl>
                                <Input
                                  className="w-full text-sm sm:text-base"
                                  placeholder={`Option ${index + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                disabled={fields.length <= 2}
                                className="flex-shrink-0"
                              >
                                <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2 w-full sm:w-auto text-sm sm:text-base"
                      onClick={() => append({ text: "" })}
                    >
                      <PlusIcon className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      Add Option
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="w-full sm:w-auto text-sm sm:text-base"
                  onClick={() => {
                    form.reset();
                    router.push("/");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="customBlue"
                  type="submit"
                  className="w-full sm:w-auto text-sm sm:text-base"
                  disabled={loading || isConfirming}
                >
                  {loading || isConfirming ? "Creating..." : "Create Poll"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
