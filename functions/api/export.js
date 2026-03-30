// API endpoint: GET /api/export
// Exports all registration data as CSV

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // Get all registrations
    const registrations = await env.DB.prepare(`
      SELECT * FROM kehadiran_pibg 
      WHERE event_id = 'pibg-hari-raya-2026'
      ORDER BY created_at DESC
    `).all();
    
    // Build CSV
    const headers = ['ID', 'Nama Ibu Bapa', 'No. Telefon', 'Bilangan Dewasa', 'Nama Murid', 'Kelas', 'Tarikh Daftar'];
    const rows = [];
    
    registrations.results.forEach(reg => {
      const students = JSON.parse(reg.students);
      students.forEach((s, index) => {
        rows.push([
          reg.id,
          reg.parent_name,
          reg.phone,
          index === 0 ? reg.attendee_count : '',
          s.name,
          s.class,
          new Date(reg.created_at).toLocaleDateString('ms-MY')
        ]);
      });
    });
    
    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
    
    return new Response(csv, {
      status: 200,
      headers: { 
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="kehadiran-pibg-${new Date().toISOString().split('T')[0]}.csv"`,
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error exporting data:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
