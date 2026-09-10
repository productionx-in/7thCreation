import { useContactInfo } from '@/lib/SiteOverridesContext';

// Persistent utility affordance, not a marketing element — kept small and
// plain rather than styled like the brand's editorial CTAs.
export function WhatsAppButton() {
  const CONTACT = useContactInfo();
  return (
    <a
      href={CONTACT.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message 7th Creation on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full sm:bottom-7 sm:right-7 sm:h-14 sm:w-14"
      style={{
        background: '#11151A',
        border: '1.5px solid rgba(198, 161, 91, 0.5)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
      }}
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 sm:h-7 sm:w-7" fill="#E6DECD" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 2.1C6.66 2.1 2.28 6.48 2.28 11.87c0 1.75.46 3.42 1.33 4.9L2.1 21.9l5.24-1.47a9.75 9.75 0 0 0 4.71 1.2h.004c5.39 0 9.77-4.38 9.77-9.77 0-2.61-1.016-5.06-2.86-6.906A9.72 9.72 0 0 0 12.05 2.1zm0 17.87h-.003a8.1 8.1 0 0 1-4.13-1.13l-.296-.176-3.11.874.83-3.032-.192-.31a8.08 8.08 0 0 1-1.24-4.33c0-4.474 3.64-8.114 8.114-8.114 2.167 0 4.203.845 5.735 2.379a8.06 8.06 0 0 1 2.378 5.74c0 4.474-3.64 8.1-8.106 8.1z" />
      </svg>
    </a>
  );
}
