import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>("NEXT_PUBLIC_SUPABASE_URL");
    const serviceRoleKey = this.configService.get<string>("SUPABASE_SERVICE_ROLE_KEY");

    if (!url || !serviceRoleKey) {
      console.warn("⚠️ SUPABASE_CREDENTIALS_MISSING: API starting in limited mode (DB features will fail).");
      this.client = {} as any;
      return;
    }

    this.client = createClient(url, serviceRoleKey, {
      auth: {
        persistSession: false
      }
    });
  }

  getClient() {
    return this.client;
  }
}
