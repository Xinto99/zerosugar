const https = require('https');

function searchImage(query) {
  const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query + ' 제품')}`;
  
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // Very basic regex to find an image URL
      const match = data.match(/<img[^>]+src="([^">]+)"/);
      if (match) {
        let imgSrc = match[1];
        if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;
        console.log("Found image:", imgSrc);
      } else {
        console.log("No image found");
      }
    });
  });
}

searchImage('죠스바 제로');
