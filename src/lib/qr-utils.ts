import type {
  WebsiteFormData,
  EmailFormData,
  PhoneFormData,
  WiFiFormData,
} from "@components/types/forms";

export const generateWebsiteQR = (data: WebsiteFormData): string => {
  return data.url;
};

export const generateEmailQR = (data: EmailFormData): string => {
  let mailtoString = `mailto:${data.email}`;
  const params: string[] = [];

  if (data.subject) {
    params.push(`subject=${encodeURIComponent(data.subject)}`);
  }

  if (data.body) {
    params.push(`body=${encodeURIComponent(data.body)}`);
  }

  if (params.length > 0) {
    mailtoString += `?${params.join("&")}`;
  }

  return mailtoString;
};

export const generatePhoneQR = (data: PhoneFormData): string => {
  return `tel:${data.phoneNumber}`;
};

export const generateWiFiQR = (data: WiFiFormData): string => {
  // WiFi QR code format: WIFI:T:WPA;S:mynetwork;P:mypass;H:true;;
  const security = data.security === "nopass" ? "nopass" : data.security;
  const password = data.security === "nopass" ? "" : data.password;
  const hidden = data.hidden ? "true" : "false";

  return `WIFI:T:${security};S:${data.ssid};P:${password};H:${hidden};;`;
};
