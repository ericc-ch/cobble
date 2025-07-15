import { renderToStaticMarkup } from 'react-dom/server';

// 1. Define your component using JSX with XML tags
const RssFeed = () => (
  <rss version="2.0">
    <channel>
      <title>My Awesome Feed</title>
      <link>http://www.example.com/</link>
      <description>An example RSS feed.</description>
      <item>
        <title>Item 1</title>
        <description>This is the first item.</description>
      </item>
      <item>
        <title>Item 2</title>
        <description>This is the second item.</description>
      </item>
    </channel>
  </rss>
);

// 2. Render the component to a string
const xmlString = renderToStaticMarkup(<RssFeed />);

// 3. Add the XML declaration (optional but recommended)
const finalXml = '<?xml version="1.0" encoding="UTF-8" ?>' + xmlString;

console.log(finalXml);