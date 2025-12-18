"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";

export function UserNav() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  return (
    <div className="flex items-center gap-4">
      {user && (
        <div className="flex flex-col items-end">
          <p className="text-sm font-medium">{user.fullName || user.primaryEmailAddress?.emailAddress}</p>
          <p className="text-xs text-muted-foreground">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>
      )}
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </div>
  );
}
