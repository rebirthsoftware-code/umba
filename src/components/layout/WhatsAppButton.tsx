import { WhatsAppLink } from "@/components/ui/WhatsAppLink";

export function WhatsAppButton() {
  return (
    <div className="wa-btn fixed bottom-5 right-5 z-30">
    <WhatsAppLink
      text="Merhaba Umba Coffee, ürünleriniz hakkında bilgi almak istiyorum."
      placement="top"
      aria-label="WhatsApp ile yazın"
      className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-all hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.3 4 14.9c0 2.6.8 5 2.3 7L4 29l7.3-2.3c2 1.1 4.1 1.6 6.3 1.6 6.6 0 12-5.3 12-11.9S22.6 3 16 3zm0 21.7c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.3 1.4 1.4-4.2-.3-.4a9.7 9.7 0 0 1-1.7-5.5C5.3 9.5 10.1 4.8 16 4.8s10.7 4.7 10.7 10.5S21.9 24.7 16 24.7zm5.8-7.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.5-1.6-.9-.8-1.6-1.9-1.8-2.2-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.4-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.6 4.9.8.3 1.4.5 1.9.7.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z" />
      </svg>
    </WhatsAppLink>
    </div>
  );
}
