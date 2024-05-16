import { Vote } from "../../generated/schema";
import { log } from "@graphprotocol/graph-ts";

function getMarkedQuotes(mark: string, markdown: string): string[] {
  let lines = markdown.split("\n");

  let quotedStrings: string[] = [];

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    let line = lines[lineIndex];

    if (line != mark) continue;

    let quotedStringLines: string[] = [];

    for (
      let quotedStringLineIndex = lineIndex + 1;
      quotedStringLineIndex < lines.length;
      quotedStringLineIndex++
    ) {
      let line = lines[quotedStringLineIndex];
      if (line.trim() == "") continue;
      if (!line.startsWith("> ")) break;
      quotedStringLines.push(line.slice(2)); // Slice of the quote "> "
    }

    let quotedString = quotedStringLines.join("\n");

    if (quotedString.trim() != "") quotedStrings.push(quotedString);
  }

  return quotedStrings;
}

// This expects votes to be ordered chronologically
export function getRepostedVoteIds(vote: Vote, votes: Vote[]): string[] {
  let reason = vote.reason;

  if (reason === null) return [];

  let quotedStrings = getMarkedQuotes("+1", reason);

  let repostedVoteIds: string[] = [];

  for (let quoteIndex = 0; quoteIndex < quotedStrings.length; quoteIndex++) {
    let found = false;

    for (let voteIndex = 0; voteIndex < votes.length; voteIndex++) {
      let vote = votes[voteIndex];
      if (vote.reason == quotedStrings[quoteIndex]) {
        repostedVoteIds.push(vote.id);
        found = true;
        break;
      }
    }

    if (!found)
      log.warning(
        `No matching vote found for repost "${quotedStrings[quoteIndex]}"`,
        [],
      );
  }

  return repostedVoteIds;
}
