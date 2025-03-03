export default {
  async fetch(request) {
    if (request.method === "POST") {
      const formData = await request.formData();
      const query = formData.get("query");

      if (!query || query.length < 3) {
        return new Response("Please enter a valid search query.", { status: 400 });
      }

      const results = await searchDuckDuckGo(query);

      let responseHtml = `<html><head><title>Search Results</title></head><body>`;
      responseHtml += `<h2>Results for: ${query}</h2><ul>`;
      results.forEach(result => {
        responseHtml += `<li><a href="${result.link}" target="_blank">${result.title}</a></li>`;
      });
      responseHtml += `</ul><br><a href="/">Search Again</a></body></html>`;

      return new Response(responseHtml, { headers: { "Content-Type": "text/html" } });
    }

    return new Response(
      `<html>
        <head><title>Telegram Search</title></head>
        <body>
          <h2>Search the Web</h2>
          <form method="POST">
            <input type="text" name="query" placeholder="Enter search term..." required>
            <button type="submit">Search</button>
          </form>
          <script>
            if (window.Telegram && window.Telegram.WebApp) {
              Telegram.WebApp.expand();
            }
          </script>
        </body>
      </html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  },
};

async function searchDuckDuckGo(query) {
  const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1&no_html=1`;
  const response = await fetch(searchUrl);
  const data = await response.json();

  if (data.RelatedTopics.length > 0) {
    return data.RelatedTopics
      .filter(topic => topic.FirstURL && topic.Text)
      .map(topic => ({ title: topic.Text, link: `https://t.me/share/url?url=${encodeURIComponent(topic.FirstURL)}` }))
      .slice(0, 5);
  }

  return [];
}
