"use client";

import { Event } from "@/types/database";
import { TemplateContent } from "@/types/template";
import { RSVPFormData } from "./TemplateSections";
import { ModernTemplate } from "./variants/ModernTemplate";
import { RusticTemplate } from "./variants/RusticTemplate";
import { TraditionalTemplate } from "./variants/TraditionalTemplate";
import { MinimalistTemplate } from "./variants/MinimalistTemplate";
import { TemplateProps } from "./shared/types";

export type { TemplateProps };
export { ModernTemplate, RusticTemplate, TraditionalTemplate, MinimalistTemplate };

export function renderTemplate(
  event: Event,
  templateContent: TemplateContent,
  primaryColor: string,
  secondaryColor: string,
  guestName: string,
  isOpened: boolean,
  onOpen: () => void,
  rsvpForm: RSVPFormData,
  onRsvpFormChange: (form: RSVPFormData) => void,
  onRsvpSubmit: (e: React.FormEvent) => void,
  rsvpSubmitted: boolean,
  isSubmitting: boolean,
  rsvps: import("@/types/database").RSVP[]
) {
  const props: TemplateProps = {
    event,
    rsvps,
    templateContent,
    primaryColor,
    secondaryColor,
    guestName,
    isOpened,
    onOpen,
    rsvpForm,
    onRsvpFormChange,
    onRsvpSubmit,
    rsvpSubmitted,
    isSubmitting,
  };

  const tid = event.template_id || "modern-1";
  if (tid.startsWith("rustik")) return <RusticTemplate {...props} />;
  if (tid.startsWith("tradisional")) return <TraditionalTemplate {...props} />;
  if (tid.startsWith("minimalis")) return <MinimalistTemplate {...props} />;
  return <ModernTemplate {...props} />;
}
