// Cloudflare Worker with D1 Database Integration
// Handles form submissions for PIBG attendance

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // API endpoint: POST /api/submit
    if (url.pathname === '/api/submit' && request.method === 'POST') {
      try {
        const data = await request.json();
        
        // Validate required fields
        if (!data.parentName || !data.phone || !data.students || data.students.length === 0) {
          return new Response(JSON.stringify({
            success: false,
            error: 'Missing required fields'
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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
          message: 'Pendaftaran berjaya!'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // GET /api/stats - Get attendance statistics
    if (url.pathname === '/api/stats' && request.method === 'GET') {
      try {
        const stats = await env.DB.prepare(`
          SELECT 
            COUNT(*) as total_registrations,
            SUM(attendee_count) as total_adults,
            COUNT(DISTINCT event_id) as events
          FROM kehadiran_pibg
        `).first();
        
        const studentsByClass = await env.DB.prepare(`
          SELECT 
            json_extract(value, '$.class') as class,
            COUNT(*) as count
          FROM kehadiran_pibg,
          json_each(students)
          GROUP BY class
          ORDER BY count DESC
        `).all();
        
        return new Response(JSON.stringify({
          success: true,
          stats: {
            totalRegistrations: stats.total_registrations,
            totalAdults: stats.total_adults,
            events: stats.events,
            studentsByClass: studentsByClass.results
          }
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
        
      } catch (error) {
        return new Response(JSON.stringify({
          success: false,
          error: error.message
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Serve static files from Pages
    return env.ASSETS.fetch(request);
  }
};
