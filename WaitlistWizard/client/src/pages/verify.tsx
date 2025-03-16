import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getQueryFn } from "@/lib/queryClient";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const verificationQuery = useQuery({
    queryKey: [`/api/verify?token=${token}`],
    enabled: !!token,
  });

  useEffect(() => {
    if (verificationQuery.isSuccess) {
      // Redirect to home after 3 seconds
      const timer = setTimeout(() => setLocation("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [verificationQuery.isSuccess, setLocation]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <h1 className="text-2xl font-bold text-destructive mb-4">
              Invalid Verification Link
            </h1>
            <p className="text-muted-foreground">
              The verification link appears to be invalid. Please check your email
              for the correct link.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          {verificationQuery.isSuccess ? (
            <>
              <h1 className="text-2xl font-bold text-primary mb-4">
                Email Verified Successfully!
              </h1>
              <p className="text-muted-foreground">
                Thank you for verifying your email. You will be redirected to the
                home page shortly.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-destructive mb-4">
                Verification Failed
              </h1>
              <p className="text-muted-foreground">
                {verificationQuery.error?.message ||
                  "Unable to verify your email. The link may have expired."}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
