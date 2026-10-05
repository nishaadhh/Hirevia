import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";

// In-memory messages store for active sessions
const messageStore: Record<string, any[]> = {};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get("conversationId");

    if (!conversationId) {
      return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
    }

    if (!messageStore[conversationId]) {
      messageStore[conversationId] = [
        {
          id: `msg-init-1`,
          conversationId,
          senderId: "cand-1",
          senderName: "Candidate",
          senderRole: "CANDIDATE",
          content: "Hello! Thank you for reviewing my AI interview assessment.",
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: `msg-init-2`,
          conversationId,
          senderId: "hr-1",
          senderName: "Devon Miller (Lead HR)",
          senderRole: "HR",
          content: "Hi there! We were very impressed with your problem-solving scores. Let's schedule the final HR discussion.",
          createdAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
    }

    return NextResponse.json({ messages: messageStore[conversationId] });
  } catch (err: any) {
    console.error("Fetch messages error:", err);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    const body = await req.json();
    const { conversationId, content } = body;

    if (!conversationId || !content) {
      return NextResponse.json({ error: "conversationId and content are required" }, { status: 400 });
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: user?.id || "hr-lead",
      senderName: user?.name || "Devon Miller (Lead HR)",
      senderRole: "HR",
      content,
      createdAt: new Date().toISOString(),
    };

    if (!messageStore[conversationId]) {
      messageStore[conversationId] = [];
    }
    messageStore[conversationId].push(newMessage);

    return NextResponse.json({
      success: true,
      message: newMessage,
    });
  } catch (err: any) {
    console.error("Send message error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
