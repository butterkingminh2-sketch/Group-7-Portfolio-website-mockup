// Side-effect UMD module — assigns window.grained.
// This file has no exports so TypeScript treats it as a global ambient file,
// making 'declare module' visible project-wide without any reference directive.
declare module 'grained';

interface GrainedOptions {
  animate?: boolean;
  patternWidth?: number;
  patternHeight?: number;
  grainOpacity?: number;
  grainDensity?: number;
  grainWidth?: number;
  grainHeight?: number;
  grainChaos?: number;
  grainSpeed?: number;
}

interface GrainedWindow extends Window {
  grained: (selector: string, options: GrainedOptions) => void;
}
