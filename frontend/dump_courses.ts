import * as fs from 'fs';
import * as path from 'path';

// Since we are running this with ts-node, we can import our TS files directly
import { ALL_COURSES } from './lib/data/courses/index';

const outputPath = path.join(__dirname, '..', 'backend', 'data', 'courses.json');

// Ensure data dir exists
const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(ALL_COURSES, null, 2));
console.log(`Successfully dumped ${ALL_COURSES.length} courses to ${outputPath}`);
