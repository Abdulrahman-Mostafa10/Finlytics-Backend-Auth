import { AdminCredentials } from './admin-whitelist.interface';
import bcrypt from 'bcryptjs';

// Config
import {config} from "../../config/config";

export class AdminWhitelistService {
  private static getAdminCredentials(): AdminCredentials[] {
    return config.admins;
  }

  static async validateAdminCredentials(email: string, password: string): Promise<boolean> {
    const adminCredentials = this.getAdminCredentials();
    const admin = adminCredentials.find(admin => admin.email === email);
    
    if (!admin) return false;
    
    // Compare plain text password with hashed password from .env
    return await bcrypt.compare(password, admin.password);
  }
}