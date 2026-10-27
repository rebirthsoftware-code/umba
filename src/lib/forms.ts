import { site } from "./site";

/** Form servisi (Formspree, Web3Forms, Getform…) tanımlı mı? */
export function formsEnabled(): boolean {
  return Boolean(site.forms.endpoint);
}

/**
 * Formu tanımlı servise JSON olarak gönderir.
 * Servis yoksa false döner; arayan taraf WhatsApp / e-posta yoluna düşer.
 */
export async function submitForm(payload: Record<string, string | number | boolean>): Promise<boolean> {
  if (!site.forms.endpoint) return false;
  const body = site.forms.accessKey ? { access_key: site.forms.accessKey, ...payload } : payload;
  try {
    const res = await fetch(site.forms.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function whatsappUrl(text: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function mailtoUrl(subject: string, body: string, to: string = site.contact.email): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
