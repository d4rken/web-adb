export interface CheckResult {
  proceed: boolean;
  message: string;
}

export interface CommandEntry {
  id: string;
  title: string;
  description: string;
  command: string | null; // null = multi-step command (e.g., accessibility service)
  risk: 'safe' | 'moderate' | 'elevated';
  check?: (run: (cmd: string) => Promise<string>) => Promise<CheckResult>;
  execute?: (run: (cmd: string) => Promise<string>) => Promise<string>;
}

export interface AppCategory {
  id: string;
  name: string;
  packageName: string;
  description: string;
  iconUrl?: string;
  commands: CommandEntry[];
}
