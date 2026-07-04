"use client";

import { useState } from "react";
import { AgentChat, AgentChatButton } from "@/components/chat/AgentChat";
import { WhatsAppChat, WhatsAppChatButton } from "@/components/chat/WhatsAppChat";

export function ChatBot() {
  const [agentOpen, setAgentOpen] = useState(false);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  const toggleAgent = () => {
    setAgentOpen((v) => {
      if (!v) setWhatsappOpen(false);
      return !v;
    });
  };

  const toggleWhatsapp = () => {
    setWhatsappOpen((v) => {
      if (!v) setAgentOpen(false);
      return !v;
    });
  };

  return (
    <>
      <AgentChat open={agentOpen} onOpenChange={setAgentOpen} />
      <WhatsAppChat open={whatsappOpen} onOpenChange={setWhatsappOpen} />
      <AgentChatButton open={agentOpen} onToggle={toggleAgent} />
      <WhatsAppChatButton open={whatsappOpen} onToggle={toggleWhatsapp} />
    </>
  );
}
