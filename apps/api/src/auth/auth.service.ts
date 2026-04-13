import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../common/supabase.service";
import type { RequestUser } from "../common/interfaces/request-user.interface";
import { SyncProfileDto } from "./dto/sync-profile.dto";

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async syncProfile(payload: SyncProfileDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: payload.id,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          avatar_url: payload.avatarUrl ?? null
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  }

  async getCurrentProfile(user: RequestUser) {
    const supabase = this.supabaseService.getClient();
    const { data } = await supabase.from("users").select("*").eq("id", user.sub).maybeSingle();

    return {
      user,
      profile: data
    };
  }
}
