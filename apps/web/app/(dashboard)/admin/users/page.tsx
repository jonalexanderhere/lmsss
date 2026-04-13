import { Shell } from "@/components/layout/shell";
import { requireRole } from "@/lib/auth";
import { getAllUsers } from "@/lib/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Shield, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTeacherModal } from "@/modules/auth/create-teacher-modal";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);
  const users = await getAllUsers();

  return (
    <Shell role="admin">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">Manage roles, teachers, and student class distributions.</p>
          </div>
          <CreateTeacherModal />
        </header>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
              <Shield className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'teacher').length}</div>
            </CardContent>
          </Card>
          <Card className="bg-secondary/5 border-secondary/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.filter(u => u.role === 'student').length}</div>
            </CardContent>
          </Card>
          <Card className="bg-accent/5 border-accent/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Newest Member</CardTitle>
              <UserPlus className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-sm truncate font-medium">{users[0]?.name || "None"}</div>
            </CardContent>
          </Card>
          <Card className="bg-muted/5 border-muted/20 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">System Role</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Admin</div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Directory</CardTitle>
            <CardDescription>A comprehensive list of all accounts in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Name</th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Email</th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Role</th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Grade/Class</th>
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {users.map((user) => (
                    <tr key={user.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-2 align-middle font-medium">{user.name}</td>
                      <td className="p-2 align-middle">{user.email}</td>
                      <td className="p-2 align-middle">
                        <Badge variant={user.role === 'admin' ? 'default' : user.role === 'teacher' ? 'secondary' : 'outline'}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-2 align-middle text-muted-foreground">
                        {user.grade} {user.class_name}
                      </td>
                      <td className="p-2 align-middle">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {user.status || 'active'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
