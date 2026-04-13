import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../common/supabase.service";

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data, error } = await this.supabaseService.getClient().from("users").select("*");

    if (error) {
      throw error;
    }

    return data;
  }
}
