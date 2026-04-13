export async function getOverallGradebook() {
  const supabase = createAdminClient();
  
  // Fetch users with role student
  const { data: students, error: studentError } = await supabase
    .from("users")
    .select("id, name, xp, class_name, grade")
    .eq("role", "student")
    .order("xp", { ascending: false });

  if (studentError) throw studentError;

  // Fetch all results
  const { data: results, error: resultError } = await supabase
    .from("results")
    .select("user_id, score, created_at");

  if (resultError) throw resultError;

  return students.map(student => {
    const studentResults = results.filter(r => r.user_id === student.id);
    const avgScore = studentResults.length > 0 
      ? Math.round(studentResults.reduce((acc, curr) => acc + curr.score, 0) / studentResults.length)
      : 0;

    return {
      ...student,
      avgScore,
      quizzesTaken: studentResults.length
    };
  });
}
