import { Injectable } from "@nestjs/common";
import { SupabaseService } from "../common/supabase.service";

const fallbackCourses = [
  {
    id: "course-net-01",
    slug: "advanced-networking-fundamentals",
    title: "Advanced Networking Fundamentals",
    category: "Networking",
    overview: "Routing, subnetting, VLAN, dan troubleshooting jaringan inti."
  },
  {
    id: "course-cyber-01",
    slug: "defensive-cybersecurity-basics",
    title: "Defensive Cybersecurity Basics",
    category: "Cybersecurity",
    overview: "Hardening, log analysis, basic SOC workflow, dan network defense."
  },
  {
    id: "course-sys-01",
    slug: "linux-server-administration",
    title: "Linux Server Administration",
    category: "System Administration",
    overview: "Linux service management, permissions, web server, dan monitoring."
  }
];

@Injectable()
export class CoursesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const { data } = await this.supabaseService.getClient().from("courses").select("*");
    return data?.length ? data : fallbackCourses;
  }

  async findOne(slug: string) {
    const { data } = await this.supabaseService
      .getClient()
      .from("courses")
      .select("*, lessons(*)")
      .eq("slug", slug)
      .maybeSingle();

    return data ?? fallbackCourses.find((course) => course.slug === slug) ?? null;
  }
}
