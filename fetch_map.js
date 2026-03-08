import fs from 'fs';
import { XMLParser } from 'fast-xml-parser';

async function main() {
  const kmlData = fs.readFileSync('map.kmz', 'utf8');
  
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });
  const jsonObj = parser.parse(kmlData);
  
  const document = jsonObj.kml.Document;
  const folders = Array.isArray(document.Folder) ? document.Folder : (document.Folder ? [document.Folder] : []);
  
  const slides = [];
  let idCounter = 1;
  
  for (const folder of folders) {
    if (!folder) continue;
    const placemarks = Array.isArray(folder.Placemark) ? folder.Placemark : (folder.Placemark ? [folder.Placemark] : []);
    
    for (const pm of placemarks) {
      const name = pm.name || '未知滑梯';
      const description = pm.description || '';
      const coordsStr = pm.Point?.coordinates || '';
      if (!coordsStr) continue;
      
      const [lng, lat] = coordsStr.split(',').map(Number);
      if (!lat || !lng) continue;
      
      const cleanDesc = description.replace(/<br>/g, '\n').replace(/<[^>]*>?/gm, '').trim() || '暂无详细描述';
      
      // Extract fields from description
      let city = '未知城市';
      const cityMatch = cleanDesc.match(/所在市\/区:\s*([^\n]+)/);
      if (cityMatch) {
        city = cityMatch[1].trim();
      } else {
        const provMatch = cleanDesc.match(/所在省份:\s*([^\n]+)/);
        if (provMatch) city = provMatch[1].trim();
      }
      
      let buildYear = 1980;
      const yearMatch = cleanDesc.match(/建成年代:\s*([^\n]+)/);
      if (yearMatch) {
        const yearStr = yearMatch[1];
        const yearNum = parseInt(yearStr.match(/\d{4}/)?.[0] || '1980', 10);
        if (!isNaN(yearNum)) buildYear = yearNum;
      }
      
      let status = 'existing';
      const statusMatch = cleanDesc.match(/当前状态:\s*([^\n]+)/);
      if (statusMatch) {
        const statusStr = statusMatch[1];
        if (statusStr.includes('拆除') || statusStr.includes('消失')) status = 'demolished';
        else if (statusStr.includes('待核实') || statusStr.includes('疑似')) status = 'unverified';
      } else {
        if (name.includes('拆除') || name.includes('已拆')) status = 'demolished';
        else if (name.includes('待核实') || name.includes('疑似')) status = 'unverified';
      }
      
      let material = '水磨石'; // default
      if (cleanDesc.includes('水泥')) material = '水泥';
      if (cleanDesc.includes('玻璃钢')) material = '玻璃钢';
      if (cleanDesc.includes('砖')) material = '砖混';
      
      let imageUrl = "";
      const imgMatch = description.match(/<img src="([^"]+)"/);
      if (imgMatch) {
        imageUrl = imgMatch[1];
      } else {
        // Try to extract from gx_media_links if img tag is not found
        const mediaLinksMatch = pm.ExtendedData?.Data?.find?.(d => d['@_name'] === 'gx_media_links');
        if (mediaLinksMatch && mediaLinksMatch.value) {
            const links = mediaLinksMatch.value.split(' ');
            if (links.length > 0) {
                imageUrl = links[0];
            }
        }
      }

      // Convert Google My Maps hosted images to use a proxy for correct inline display
      if (imageUrl && imageUrl.includes('mymaps.usercontent.google.com')) {
        // Remove the ?fife=... parameter if present
        const cleanUrl = imageUrl.split('?')[0];
        imageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(cleanUrl)}&w=800`;
      }
      
      slides.push({
        id: "ES-" + String(idCounter).padStart(3, '0'),
        nickname: name.replace(/<[^>]*>?/gm, ''),
        city: city,
        location: name.replace(/<[^>]*>?/gm, ''),
        status,
        buildYear,
        material,
        coordinates: [lat, lng],
        description: cleanDesc,
        imageUrl
      });
      idCounter++;
    }
  }
  
  const fileContent = "import { ElephantSlide } from './types';\n\nexport const slidesData: ElephantSlide[] = " + JSON.stringify(slides, null, 2) + ";\n";

  fs.writeFileSync('src/data.ts', fileContent);
  console.log('Successfully updated src/data.ts with ' + slides.length + ' slides');
}

main().catch(console.error);
