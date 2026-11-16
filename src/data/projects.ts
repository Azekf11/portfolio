import type { ImageMetadata } from 'astro';
import data from './projects.json';

export type Category = 'featured' | 'learning';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  status?: string;
  highlights: string[];
  stack: string[];
  links: ProjectLink[];
  image?: string;
  imageAlt?: string;
  category: Category;
  order: number;
}

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

export function projectImage(file?: string): ImageMetadata | undefined {
  if (!file) return undefined;
  const match = images[`../assets/projects/${file}`];
  if (!match) throw new Error(`projects.json: image "${file}" not found in src/assets/projects/`);
  return match.default;
}

const projects = (data.projects as Project[]).slice();

for (const p of projects) {
  if (p.category !== 'featured' && p.category !== 'learning') {
    throw new Error(`projects.json: "${p.id}" has unknown category "${p.category}"`);
  }
  projectImage(p.image);
}

export function byCategory(category: Category): Project[] {
  return projects.filter((p) => p.category === category).sort((a, b) => a.order - b.order);
}

export function allStack(): string[] {
  return [...new Set(projects.flatMap((p) => p.stack))];
}
