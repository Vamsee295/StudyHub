import fs from 'fs';
import path from 'path';

import { directoryCompanies } from '../lib/data/companiesData';
import { libraryCategories } from '../lib/data/resourcesData';
import { RESOURCE_CATALOG } from '../lib/resources';

const outputDir = path.join(__dirname, '../../backend/scripts');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Only what backend/scripts/seed_data.py reads.
const seedData = {
    companies: directoryCompanies,
    // the real PDF catalog, shaped like the fields seed_data.py reads
    resources: RESOURCE_CATALOG.map((r) => ({ id: r.id, title: r.title, description: r.description, track: r.category, slug: r.id, author: 'StudyHub', isVerified: false })),
    resourceCategories: libraryCategories
};

fs.writeFileSync(
    path.join(outputDir, 'seed_data.json'),
    JSON.stringify(seedData, null, 2)
);

console.log('Successfully exported seed data to backend/scripts/seed_data.json');
