import fs from 'fs';
import path from 'path';

import { COMPANIES, monogram } from '../lib/data/companyData';
import { libraryCategories } from '../lib/data/resourcesData';
import { RESOURCE_CATALOG } from '../lib/resources';

const outputDir = path.join(__dirname, '../../backend/scripts');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Only what backend/scripts/seed_data.py reads.
const seedData = {
    // the companies /companies shows (real data from scripts/import-company-data.py), in the fields seed_data.py reads
    companies: COMPANIES.map((c) => ({
        id: c.id,
        name: c.name,
        monogram: monogram(c.name),
        segment: c.segment,
        location: c.facts.hq ?? '',
        processSummary: `${c.counts.total} interview questions reported`,
    })),
    // the real PDF catalog, shaped like the fields seed_data.py reads
    resources: RESOURCE_CATALOG.map((r) => ({ id: r.id, title: r.title, description: r.description, track: r.category, slug: r.id, author: 'StudyHub', isVerified: false })),
    resourceCategories: libraryCategories
};

fs.writeFileSync(
    path.join(outputDir, 'seed_data.json'),
    JSON.stringify(seedData, null, 2)
);

console.log('Successfully exported seed data to backend/scripts/seed_data.json');
