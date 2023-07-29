`use client`;
import { Providers } from "./providers";
import { ClerkProvider } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider publishableKey={clerkPubKey}>
          <Providers>
            <div style={{ height: "90vh" }}>
              {children}
            </div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
