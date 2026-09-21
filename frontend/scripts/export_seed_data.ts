import fs from 'fs';
import path from 'path';

import { targetCompanies, directoryCompanies, companyWorkspaces } from '../lib/data/companiesData';
import { learnSubjects, learnPaths } from '../lib/data/learnData';
import { roadmapModules } from '../lib/data/roadmapModules';
import { roadmap } from '../lib/data/roadmap';
import { paths } from '../lib/data/paths';
import { curriculumBanks, quickSprints } from '../lib/data/practiceData';
import { libraryCategories, curatedPlacementResources } from '../lib/data/resourcesData';

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
    resources: curatedPlacementResources,
    resourceCategories: libraryCategories
};

fs.writeFileSync(
    path.join(outputDir, 'seed_data.json'),
    JSON.stringify(seedData, null, 2)
);

console.log('Successfully exported seed data to backend/scripts/seed_data.json');
