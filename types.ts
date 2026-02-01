
export interface ShortenRequest {
  url: string;
  slug?: string;
}

export interface ShortenResponse {
  success: boolean;
  shortUrl: string;
  message?: string;
}

export interface RedirectResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
