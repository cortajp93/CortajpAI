import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DrawingCanvas } from "@/components/DrawingCanvas";

const inpaintSchema = z.object({
  prompt: z.string().min(1, "Please provide a prompt for inpainting"),
});

type InpaintForm = z.infer<typeof inpaintSchema>;

export default function InpaintPage() {
  const { toast } = useToast();
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [maskData, setMaskData] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const form = useForm<InpaintForm>({
    resolver: zodResolver(inpaintSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setMaskData(null); // Reset mask when new image is uploaded
    },
  });

  const inpaintMutation = useMutation({
    mutationFn: async ({ prompt }: InpaintForm) => {
      if (!image) throw new Error("No image selected");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("prompt", prompt);
      if (maskData) {
        formData.append("maskData", maskData);
      }

      const res = await fetch("/api/inpaint", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      return res.json();
    },
    onSuccess: (data) => {
      setProcessedImage(data.image.processedUrl);
      toast({
        title: "Success",
        description: "Image processed successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: InpaintForm) => {
    inpaintMutation.mutate(data);
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-4xl font-bold">AI Inpainting</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Image</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary"
          >
            <input {...getInputProps()} />
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto"
              />
            ) : (
              <p>Drag & drop an image here, or click to select one</p>
            )}
          </div>

          {imagePreview && (
            <>
              <h3 className="text-xl font-semibold mt-6 mb-4">Draw Mask</h3>
              <DrawingCanvas
                imageUrl={imagePreview}
                onMaskChange={setMaskData}
              />
            </>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inpainting Prompt</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Describe what you want to add..."
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!image || !maskData || inpaintMutation.isPending}
                className="w-full"
              >
                {inpaintMutation.isPending ? "Processing..." : "Generate"}
              </Button>
            </form>
          </Form>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Result</h2>
          {processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="max-h-96 mx-auto"
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Processed image will appear here
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}