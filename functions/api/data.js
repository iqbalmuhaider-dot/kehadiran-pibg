// API endpoint: GET /api/data
// Returns all registration data for admin dashboard

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // Get all registrations
    const registrations = await env.DB.prepare(`
      SELECT * FROM kehadiran_pibg 
      WHERE event_id = 'pibg-hari-raya-2026'
      ORDER BY created_at DESC
    `).all();
    
    // Get total stats
    const stats = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_registrations,
        SUM(attendee_count) as total_adults
      FROM kehadiran_pibg
      WHERE event_id = 'pibg-hari-raya-2026'
    `).first();
    
    // Get total students
    const studentCount = await env.DB.prepare(`
      SELECT COUNT(*) as total_students
      FROM kehadiran_pibg,
      json_each(students)
      WHERE event_id = 'pibg-hari-raya-2026'
    `).first();
    
    // Get count by class
    const byClass = await env.DB.prepare(`
      SELECT 
        json_extract(value, '$.class') as class,
        COUNT(*) as count
      FROM kehadiran_pibg,
      json_each(students)
      WHERE event_id = 'pibg-hari-raya-2026'
      GROUP BY class
      ORDER BY count DESC
    `).all();
    
    // Get count by date
    const byDate = await env.DB.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM kehadiran_pibg
      WHERE event_id = 'pibg-hari-raya-2026'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all();
    
    return new Response(JSON.stringify({
      success: true,
      registrations: registrations.results,
      stats: {
        totalRegistrations: stats.total_registrations || 0,
        totalAdults: stats.total_adults || 0,
        totalStudents: studentCount.total_students || 0,
        byClass: byClass.results,
        byDate: byDate.results
      }
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Error fetching data:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
