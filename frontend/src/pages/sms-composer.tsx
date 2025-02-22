import React from 'react';
import { SmsComposer } from '../components/sms-composer';

export default function SmsComposerPage() {
  // Get query parameters from URL
  const params = new URLSearchParams(window.location.search);
  const portalId = params.get('portalId') || '';
  const objectId = params.get('objectId') || '';
  const phoneNumber = params.get('phone') || '';

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
