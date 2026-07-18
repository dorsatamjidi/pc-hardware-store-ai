import { ChatWindow } from "@/components/chat/chat-window";

export const metadata = { title: "AI Assistant" };

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Shopping Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Grounded in our actual product catalog — ask for recommendations, compatibility help,
          or explanations of hardware terms.
        </p>
      </div>
      <ChatWindow />
    </div>
  );
}
