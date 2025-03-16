import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertWaitlistSchema, type InsertWaitlist } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { trackEvent } from "@/lib/analytics";

export default function Home() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const form = useForm<InsertWaitlist>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      email: "",
    },
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: InsertWaitlist) => {
      const res = await apiRequest("POST", "/api/waitlist", data);
      return res.json();
    },
    onSuccess: (response) => {
      toast({
        title: "Success!",
        description: response.message,
      });
      trackEvent("waitlist_signup", { email });
      setEmail("");
      form.reset();

      // Show verification link in development
      if (response.verificationLink) {
        toast({
          title: "Verification Required",
          description: (
            <div>
              <p>Please verify your email by clicking the link:</p>
              <a 
                href={response.verificationLink} 
                className="text-primary hover:underline"
              >
                Verify Email
              </a>
            </div>
          ),
          duration: 10000,
        });
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (data: InsertWaitlist) => {
    waitlistMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-24 md:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506443102696-39d0c10eae2b"
            alt=""
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from
-primary to-primary/70 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Transform Your Business
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
              Join the waitlist for the next generation of business analytics. Be the first to experience
              the future of data-driven decision making.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf"
                alt="Analytics Dashboard"
                className="w-full h-48 object-cover rounded-md mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">Make data-driven decisions with our powerful analytics platform</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa"
                alt="Team Collaboration"
                className="w-full h-48 object-cover rounded-md mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-muted-foreground">Work together seamlessly with built-in collaboration tools</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-background shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1444653389962-8149286c578a"
                alt="Secure Platform"
                className="w-full h-48 object-cover rounded-md mb-6"
              />
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-muted-foreground">Your data is protected with enterprise-grade security</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1626690396940-8929be269d23"
            alt=""
            className="w-full h-full object-cover opacity-5"
          />
        </div>
        
        <div className="mx-auto max-w-md px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Waitlist</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="text-center"
                        {...field}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          field.onChange(e);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={waitlistMutation.isPending}
              >
                {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
              </Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}