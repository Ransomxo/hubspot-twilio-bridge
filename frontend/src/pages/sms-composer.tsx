import React from "react";
import { SmsComposer } from "../components/sms-composer";

interface SmsComposerPageProps {}

export default function SmsComposerPage({}: SmsComposerPageProps) {
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const portalId = params.get("portalId") || "";
  const objectId = params.get("objectId") || "";
  const phoneNumber = params.get("phone") || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <SmsComposer
        portalId={portalId}
        objectId={objectId}
        phoneNumber={phoneNumber}
      />
    </div>
  );
}
