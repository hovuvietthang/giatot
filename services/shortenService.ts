
import { ShortenRequest, ShortenResponse, RedirectResponse } from '../types';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlyYCPov5n3c6aKahZ-p2KJqOQRAm7A-O7i4gbhsKVsIbToiODTrTTI0zNEQSb0_Oy/exec'; // This should come from VITE_APPS_SCRIPT_URL normally

/**
 * Handles communication with Google Apps Script
 * Note: GAS can be tricky with CORS. We use redirect: 'follow' and assume the script 
 * returns a JSON response via ContentService.
 */
export const shortenService = {
  /**
   * Shortens an original URL with an optional custom slug
   */
  shorten: async (data: ShortenRequest): Promise<ShortenResponse> => {
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'shorten',
          ...data
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error shortening link:', error);
      return { success: false, shortUrl: '', message: 'Lỗi kết nối đến máy chủ.' };
    }
  },

  /**
   * Retrieves the original URL based on a slug
   */
  getOriginalUrl: async (slug: string): Promise<RedirectResponse> => {
    try {
      const response = await fetch(`${APPS_SCRIPT_URL}?id=${slug}`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error getting original URL:', error);
      return { success: false, message: 'Không thể tìm thấy liên kết hoặc lỗi hệ thống.' };
    }
  }
};
