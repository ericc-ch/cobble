// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck I really have no other choice, can't wrap my head around why the JSX isn't properly typed

import {
  getCurrentBranchName,
  getRecentCommits,
  getStagedDiff,
} from "~/lib/git"
import { replacePlaceholders } from "~/lib/template"

import template from "./git-commit.txt"

export async function buildGitCommitPrompt(options: {
  additionalInstruction?: string
}) {
  const workingDir = process.cwd()

  return replacePlaceholders(template, {
    branch_name: await getCurrentBranchName(workingDir),
    recent_commits: await getRecentCommits(workingDir),
    staged_diff: await getStagedDiff(workingDir),
    user_query:
      options.additionalInstruction ?? "Generate a conventional commit message",
  })
}
