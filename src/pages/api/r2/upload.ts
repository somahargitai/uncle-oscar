import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2Client';

// Increase the body size limit to 10MB
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Get the auth token from headers
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Unauthorized',
      details: 'Missing authentication token'
    });
  }

  const token = authHeader.split(' ')[1];

  // Create a new Supabase client with the user's token
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    }
  );

  try {
    // Verify the token and get user info
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        details: 'Invalid authentication token'
      });
    }

    const { file, title, description, caption } = req.body;
    
    if (!file) {
      return res.status(400).json({ 
        error: 'Bad Request',
        details: 'No file provided'
      });
    }

    // Decode base64 file data
    const base64Data = file.split(',')[1];
    if (!base64Data) {
      return res.status(400).json({ 
        error: 'Bad Request',
        details: 'Invalid file format'
      });
    }

    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const fileExt = file.split(';')[0].split('/')[1];
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    try {
      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: 'oszkarbacsi',
        Key: fileName,
        Body: buffer,
        ContentType: `image/${fileExt}`,
      });

      await r2Client.send(command);
    } catch (uploadError) {
      console.error('R2 upload error:', uploadError);
      return res.status(500).json({ 
        error: 'Upload Failed',
        details: 'Failed to upload to storage'
      });
    }

    // Create database record with the authenticated client
    const { data, error: dbError } = await supabase
      .from('photos')
      .insert({
        title,
        description,
        caption,
        url: `/api/r2/${fileName}`,
        user_id: user.id,
        uploaded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Error in upload handler:', error);
    return res.status(500).json({ 
      error: 'Server Error',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
} 