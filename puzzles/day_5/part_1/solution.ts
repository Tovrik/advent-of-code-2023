import { readFileSync } from "fs";

function splitFileIntoSections(data: string): Map<string, string> {
  const sections = new Map<string, string>();

  const sectionTitles = data.match(/^.+:/gm);
  if (!sectionTitles) {
    return sections;
  }

  for (let i = 0; i < sectionTitles.length; i++) {
    const start = data.indexOf(sectionTitles[i]);
    const end =
      i < sectionTitles.length - 1
        ? data.indexOf(sectionTitles[i + 1])
        : data.length;
    const sectionContent = data
      .substring(start + sectionTitles[i].length, end)
      .trim();

    sections.set(sectionTitles[i].slice(0, -1).trim(), sectionContent);
  }

  return sections;
}

function extractSeeds(data: string): Seed[] {
  const seeds = data.split(" ").filter((word) => word.match(/^[0-9]+$/));
  return seeds.map((seed) => {
    return new Seed(parseInt(seed));
  });
}

class Seed {
  constructor(public id: number) {}
}

class CRange {
  constructor(public min: number, public max: number) {}
}

class Instruction {
  constructor(public destinationRange: CRange, public sourceRange: CRange) {}

  getOffset() {
    return this.destinationRange.min - this.sourceRange.min;
  }

  inRange(source: number) {
    return source >= this.sourceRange.min && source <= this.sourceRange.max;
  }

  getDestination(source: number) {
    if (this.inRange(source)) {
      return source + this.getOffset();
    }
  }
}

class InstructionSet {
  constructor(public name: string, public instructions: Instruction[] = []) {}

  addInstruction(instruction: Instruction) {
    this.instructions.push(instruction);
  }

  getInstruction(source: number): Instruction | undefined {
    return this.instructions.find((instruction) => instruction.inRange(source));
  }
}

let SEEDS: Seed[] = [];
const INSTRUCTION_SETS: Map<string, InstructionSet> = new Map();

const data = readFileSync("./input.txt", "utf8");
const sections = splitFileIntoSections(data);

sections.forEach((sectionInfo, sectionTitle) => {
  if (sectionTitle === "seeds") {
    SEEDS = extractSeeds(sectionInfo);
  } else {
    const instructions = sectionInfo.split("\n");
    const instructionSet = new InstructionSet(sectionTitle);
    instructions.forEach((instruction) => {
      const nums = instruction.split(" ");
      instructionSet.addInstruction(
        new Instruction(
          new CRange(
            parseInt(nums[0]),
            parseInt(nums[0]) + parseInt(nums[2]) - 1
          ),
          new CRange(
            parseInt(nums[1]),
            parseInt(nums[1]) + parseInt(nums[2]) - 1
          )
        )
      );
    });
    INSTRUCTION_SETS.set(sectionTitle, instructionSet);
  }
});

const locations: number[] = [];

SEEDS.forEach((seed) => {
  // find soil
  const soil_instruction = INSTRUCTION_SETS.get(
    "seed-to-soil map"
  )?.getInstruction(seed.id);
  const soil_destination = soil_instruction?.getDestination(seed.id) ?? seed.id;

  // find fertilizer
  const fertilizer_instruction = INSTRUCTION_SETS.get(
    "soil-to-fertilizer map"
  )?.getInstruction(soil_destination);
  const fertilizer_destination =
    fertilizer_instruction?.getDestination(soil_destination) ??
    soil_destination;

  // find water
  const water_instruction = INSTRUCTION_SETS.get(
    "fertilizer-to-water map"
  )?.getInstruction(fertilizer_destination);
  const water_destination =
    water_instruction?.getDestination(fertilizer_destination) ??
    fertilizer_destination;

  // find light
  const light_instruction =
    INSTRUCTION_SETS.get("water-to-light map")?.getInstruction(
      water_destination
    );
  const light_destination =
    light_instruction?.getDestination(water_destination) ?? water_destination;

  // find temperature
  const temperature_instruction = INSTRUCTION_SETS.get(
    "light-to-temperature map"
  )?.getInstruction(light_destination);
  const temperature_destination =
    temperature_instruction?.getDestination(light_destination) ??
    light_destination;

  // find humidity
  const humidity_instruction = INSTRUCTION_SETS.get(
    "temperature-to-humidity map"
  )?.getInstruction(temperature_destination);
  const humidity_destination =
    humidity_instruction?.getDestination(temperature_destination) ??
    temperature_destination;

  //find location
  const location_instruction = INSTRUCTION_SETS.get(
    "humidity-to-location map"
  )?.getInstruction(humidity_destination);
  const location_destination =
    location_instruction?.getDestination(humidity_destination) ??
    humidity_destination;

  console.log(`Seed ${seed.id}: 
  soil ${soil_destination}
  fertilizer ${fertilizer_destination}
  water ${water_destination}
  light ${light_destination}
  temperature ${temperature_destination}
  humidity ${humidity_destination}
  location ${location_destination}`);

  locations.push(location_destination);
});

console.log(
  locations.reduce(function (p, v) {
    return p < v ? p : v;
  })
);
