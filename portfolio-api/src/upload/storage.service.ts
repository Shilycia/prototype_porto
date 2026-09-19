import { Injectable, Logger } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  destination?: string;
  filename?: string;
  path?: string;
}

export interface UploadResult {
  fileId: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  provider: 'gdrive' | 'local';
}

function parseFolderId(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const folderMatch = trimmed.match(/folders\/([a-zA-Z0-9_-]+)/);
  if (folderMatch && folderMatch[1]) return folderMatch[1];
  const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch && idMatch[1]) return idMatch[1];
  return trimmed.split('?')[0].split('&')[0];
}

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private driveClient: drive_v3.Drive | null = null;
  private folderId: string | null = null;
  private readonly uploadDir = path.resolve(process.cwd(), 'uploads');

  constructor() {
    this.initStorage();
  }

  private initStorage() {
    // Ensure local fallback uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const folderId = parseFolderId(process.env.GOOGLE_DRIVE_FOLDER_ID);
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (serviceEmail && privateKey) {
      try {
        const auth = new google.auth.JWT({
          email: serviceEmail,
          key: privateKey,
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
        this.driveClient = google.drive({ version: 'v3', auth });
        this.folderId = folderId || null;
        this.logger.log(`Google Drive Storage initialized via Service Account (Folder ID: ${this.folderId || 'root'}).`);
      } catch (err: any) {
        this.logger.warn(`Failed to initialize Google Drive Service Account: ${err.message}`);
      }
    } else if (clientId && clientSecret && refreshToken) {
      try {
        const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
        oauth2Client.setCredentials({ refresh_token: refreshToken });
        this.driveClient = google.drive({ version: 'v3', auth: oauth2Client });
        this.folderId = folderId || null;
        this.logger.log(`Google Drive Storage initialized via OAuth2 Refresh Token (Folder ID: ${this.folderId || 'root'}).`);
      } catch (err: any) {
        this.logger.warn(`Failed to initialize Google Drive OAuth2: ${err.message}`);
      }
    } else {
      this.logger.log(
        'No Google Drive credentials found in environment. Storage operating in Local Fallback mode (/uploads).'
      );
    }
  }

  async uploadFile(file: MulterFile, requestBaseUrl?: string): Promise<UploadResult> {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    // Clean safe filename
    const timestamp = Date.now();
    const cleanOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const safeFilename = `${timestamp}_${cleanOriginalName}`;

    // 1. If Google Drive is configured, upload to Google Drive
    if (this.driveClient) {
      try {
        const stream = Readable.from(file.buffer);
        const fileMetadata: drive_v3.Schema$File = {
          name: safeFilename,
        };

        if (this.folderId) {
          fileMetadata.parents = [this.folderId];
        }

        const driveResponse = await this.driveClient.files.create({
          requestBody: fileMetadata,
          media: {
            mimeType: file.mimetype,
            body: stream,
          },
          fields: 'id, name, webViewLink, webContentLink',
        });

        const fileId = driveResponse.data.id;
        if (!fileId) {
          throw new Error('Google Drive did not return a file ID.');
        }

        // Set public reader permission so anyone can view the file on the portfolio
        try {
          await this.driveClient.permissions.create({
            fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone',
            },
          });
        } catch (permErr: any) {
          this.logger.warn(`Failed setting public permission on file ${fileId}: ${permErr.message}`);
        }

        // Generate direct CDN URL that renders cleanly in <img> and <video> tags
        const directUrl = `https://lh3.googleusercontent.com/d/${fileId}`;

        this.logger.log(`Uploaded file to Google Drive: ${safeFilename} (ID: ${fileId})`);

        return {
          fileId,
          url: directUrl,
          filename: safeFilename,
          mimeType: file.mimetype,
          size: file.size,
          provider: 'gdrive',
        };
      } catch (err: any) {
        this.logger.error(`Google Drive upload failed: ${err.message}. Falling back to local storage.`);
      }
    }

    // 2. Fallback to Local Storage
    const localFilePath = path.join(this.uploadDir, safeFilename);
    fs.writeFileSync(localFilePath, file.buffer);

    const defaultUrl = 'http://43.173.33.116:3001';
    const baseUrl = (process.env.API_BASE_URL || requestBaseUrl || defaultUrl).replace(/\/+$/, '');
    const localUrl = `${baseUrl}/uploads/${safeFilename}`;

    this.logger.log(`Uploaded file to local storage: ${localFilePath}`);

    return {
      fileId: `local:${safeFilename}`,
      url: localUrl,
      filename: safeFilename,
      mimeType: file.mimetype,
      size: file.size,
      provider: 'local',
    };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    if (!fileId) return false;

    // Local file deletion
    if (fileId.startsWith('local:')) {
      const filename = fileId.replace('local:', '');
      const filePath = path.join(this.uploadDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          this.logger.log(`Deleted local file: ${filename}`);
          return true;
        } catch (err: any) {
          this.logger.error(`Failed to delete local file ${filename}: ${err.message}`);
          return false;
        }
      }
      return false;
    }

    // Google Drive deletion
    if (this.driveClient) {
      try {
        await this.driveClient.files.delete({ fileId });
        this.logger.log(`Deleted Google Drive file ID: ${fileId}`);
        return true;
      } catch (err: any) {
        this.logger.warn(`Failed to delete Google Drive file ${fileId}: ${err.message}`);
        return false;
      }
    }

    return false;
  }

  extractFileId(url: string): string | null {
    if (!url || typeof url !== 'string') return null;

    // 1. Google Usercontent CDN: https://lh3.googleusercontent.com/d/{fileId}
    const lh3Match = url.match(/googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
    if (lh3Match && lh3Match[1]) return lh3Match[1];

    // 2. Google Drive /file/d/{fileId}
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) return driveMatch[1];

    // 3. Google Drive ?id={fileId}
    const idParamMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) return idParamMatch[1];

    // 4. Local fallback upload: /uploads/{filename} or http://.../uploads/{filename}
    if (url.includes('/uploads/')) {
      const parts = url.split('/uploads/');
      if (parts[1]) {
        const cleanFilename = parts[1].split('?')[0].split('#')[0];
        return `local:${cleanFilename}`;
      }
    }

    return null;
  }

  async deleteFileByUrl(url: string): Promise<boolean> {
    const fileId = this.extractFileId(url);
    if (!fileId) return false;
    return await this.deleteFile(fileId);
  }
}
