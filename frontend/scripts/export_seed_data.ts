import fs from 'fs';
import path from 'path';

import { directoryCompanies, companyWorkspaces } from '../lib/data/companiesData';
import { learnSubjects } from '../lib/data/learnData';
import { roadmapModules } from '../lib/data/roadmapModules';
import { roadmap } from '../lib/data/roadmap';
import { paths } from '../lib/data/paths';
import { curriculumBanks } from '../lib/data/practiceData';
import { libraryCategories } from '../lib/data/resourcesData';
import { RESOURCE_CATALOG } from '../lib/resources';

const outputDir = path.join(__dirname, '../../backend/scripts');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const seedData = {
    companies: directoryCompanies,
    companyWorkspaces: companyWorkspaces,
    learnSubjects: learnSubjects,
    roadmapModules: roadmapModules,
    roadmapStages: roadmap,
    learningPaths: paths,
    practiceCurriculum: curriculumBanks,
    // the real PDF catalog, shaped like the fields seed_data.py reads
    resources: RESOURCE_CATALOG.map((r) => ({ id: r.id, title: r.title, description: r.description, track: r.category, slug: r.id, author: 'StudyHub', isVerified: false })),
    resourceCategories: libraryCategories
};

fs.writeFileSync(
    path.join(outputDir, 'seed_data.json'),
    JSON.stringify(seedData, null, 2)
);

console.log('Successfully exported seed data to backend/scripts/seed_data.json');
