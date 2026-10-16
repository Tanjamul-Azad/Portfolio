export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface GitHubActivity {
  username: string;
  profileUrl: string;
  calendar: { days: ContributionDay[]; total: number } | null;
  repositories: number | null;
  updatedAt: string;
}
