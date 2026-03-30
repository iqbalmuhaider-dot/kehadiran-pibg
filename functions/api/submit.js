// API endpoint: POST /api/submit
// Handles form submission and saves to D1 database

export async function onRequestPost(context) {
  const { request, env } = context;
  
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.parentName || !data.phone || !data.students || data.students.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Insert into D1 database
    const stmt = env.DB.prepare(`
      INSERT INTO kehadiran_pibg (
        parent_name,
        phone,
        attendee_count,
        students,
        event_id,
        submitted_at,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `);
    
    const result = await stmt.bind(
      data.parentName,
      data.phone,
      data.attendeeCount,
      JSON.stringify(data.students),
      data.eventId || 'pibg-hari-raya-2026',
      data.submittedAt
    ).run();
    
    return new Response(JSON.stringify({
      success: true,
      id: result.meta.last_row_id,
      message: 'Pendaftaran berjaya! Terima kasih.'
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
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
