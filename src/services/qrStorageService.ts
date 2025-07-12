
import { supabase } from '@/integrations/supabase/client';

export const uploadQRCodeToStorage = async (
  qrCodeDataUrl: string,
  invitationCode: string,
  userId: string
): Promise<string | null> => {
  try {
    // Convert data URL to blob
    const response = await fetch(qrCodeDataUrl);
    const blob = await response.blob();
    
    // Create file path with user folder structure
    const fileName = `${invitationCode}-${Date.now()}.png`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('qr-codes')
      .upload(filePath, blob, {
        contentType: 'image/png',
        upsert: false
      });

    if (error) {
      console.error('Error uploading QR code:', error);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('qr-codes')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadQRCodeToStorage:', error);
    return null;
  }
};

export const deleteQRCodeFromStorage = async (publicUrl: string): Promise<boolean> => {
  try {
    // Extract file path from public URL
    const urlParts = publicUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const userId = urlParts[urlParts.length - 2];
    const filePath = `${userId}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('qr-codes')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting QR code:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteQRCodeFromStorage:', error);
    return false;
  }
};
