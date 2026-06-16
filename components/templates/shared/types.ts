import { RSVPFormData } from "../TemplateSections";
import { Event, RSVP } from "@/types/database";
import { TemplateContent } from "@/types/template";

export interface TemplateProps {
  event: Event;
  rsvps: RSVP[];
  templateContent: TemplateContent;
  primaryColor: string;
  secondaryColor: string;
  guestName: string;
  isOpened: boolean;
  onOpen: () => void;
  rsvpForm: RSVPFormData;
  onRsvpFormChange: (form: RSVPFormData) => void;
  onRsvpSubmit: (e: React.FormEvent) => void;
  rsvpSubmitted: boolean;
  isSubmitting: boolean;
}
