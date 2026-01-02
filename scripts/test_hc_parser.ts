#!/usr/bin/env node
import * as fs from 'fs';
import { HCParser } from '../src/parsers/ck/hc';

console.log('=== HC Parser Test ===\n');

// Read HC file
const hcPath = '/home/user/uploaded_files/HC020250102.DAT';
const hcContent = fs.readFileSync(hcPath, 'utf-8');

const parser = new HCParser();
const records = parser.parseFile(hcContent);

console.log(`Total records: ${records.length}`);

// Group by race
const raceMap = parser.groupByRace(records);
console.log(`Total races: ${raceMap.size}\n`);

// Show first 3 races
let count = 0;
for (const [key, horses] of raceMap) {
  if (count >= 3) break;
  
  const firstHorse = horses[0];
  console.log(`Race ${count + 1}: ${key}`);
  console.log(`  Track: ${parser.getTrackName(firstHorse.track_code)} (${firstHorse.track_code})`);
  console.log(`  Date: ${firstHorse.race_date}`);
  console.log(`  Race Number: ${firstHorse.race_number}`);
  console.log(`  Horses: ${horses.length}`);
  console.log(`  Horse Numbers: ${horses.map(h => h.horse_number).join(', ')}`);
  console.log();
  
  count++;
}

// Show sample horse data
console.log('Sample Horse Data:');
const sampleHorse = records[0];
console.log(JSON.stringify(sampleHorse, null, 2));
