export interface WebsiteFormData {
  url: string;
}

export interface EmailFormData {
  email: string;
  subject?: string;
  body?: string;
}

export interface PhoneFormData {
  phoneNumber: string;
}

export interface WiFiFormData {
  ssid: string;
  password: string;
  security: 'WPA' | 'WPA2' | 'WEP' | 'nopass';
  hidden: boolean;
}

export type PresetType = 'website' | 'email' | 'phone' | 'wifi';

export type FormData = WebsiteFormData | EmailFormData | PhoneFormData | WiFiFormData;
