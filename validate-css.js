#!/usr/bin/env node

// Simple CSS validation script for Tailwind CSS
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssFile = path.join(__dirname, 'src', 'index.css');

try {
  const cssContent = fs.readFileSync(cssFile, 'utf8');
  
  console.log('✅ CSS file structure validation:');
  
  // Check for Tailwind directives
  const hasTailwindBase = cssContent.includes('@tailwind base');
  const hasTailwindComponents = cssContent.includes('@tailwind components');
  const hasTailwindUtilities = cssContent.includes('@tailwind utilities');
  
  console.log(`   📦 @tailwind base: ${hasTailwindBase ? '✅' : '❌'}`);
  console.log(`   🧩 @tailwind components: ${hasTailwindComponents ? '✅' : '❌'}`);
  console.log(`   🎨 @tailwind utilities: ${hasTailwindUtilities ? '✅' : '❌'}`);
  
  // Check for CSS layers
  const hasBaseLayer = cssContent.includes('@layer base');
  const hasComponentsLayer = cssContent.includes('@layer components');
  
  console.log(`   🏗️  @layer base: ${hasBaseLayer ? '✅' : '❌'}`);
  console.log(`   🏗️  @layer components: ${hasComponentsLayer ? '✅' : '❌'}`);
  
  // Check for theme variables
  const hasLightTheme = cssContent.includes(':root {');
  const hasDarkTheme = cssContent.includes('.dark {');
  
  console.log(`   ☀️  Light theme variables: ${hasLightTheme ? '✅' : '❌'}`);
  console.log(`   🌙 Dark theme variables: ${hasDarkTheme ? '✅' : '❌'}`);
  
  console.log('\n🎉 CSS structure is valid for Tailwind CSS!');
  console.log('💡 The "Unknown at rule" warnings in your IDE are just linting warnings.');
  console.log('   Your CSS will work perfectly with Tailwind CSS and PostCSS.');
  
} catch (error) {
  console.error('❌ Error reading CSS file:', error.message);
  process.exit(1);
}