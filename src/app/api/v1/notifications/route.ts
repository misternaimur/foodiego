import { NextResponse } from "next/server";
import { getOptionalSession } from "@/lib/dal";
import { backendFetchAsUser, BackendError } from "@/lib/backend";

export interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

// UPDATE (notification-system fix): real notifications, replacing what used
// to be a hardcoded local array on the vendor and admin notification pages
// (and no notification surface at all for customers/riders). Works for any
// authenticated role — foodiego-backend's /api/notifications route just
// returns whatever belongs to the calling user.
export async function GET() {
  const session = await getOptionalSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await backendFetchAsUser<{ notifications: NotificationItem[]; unreadCount: number }>(
      session,
      "/api/notifications?limit=30"
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to load notifications:", error);
    const status = error instanceof BackendError ? error.status : 500;
    return NextResponse.json({ error: "Failed to load notifications" }, { status });
  }
}
