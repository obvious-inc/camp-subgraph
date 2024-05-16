import { VoteCast } from "../generated/NounsDAOV4/NounsDAOV4";
import { Account, Proposal, Vote } from "../generated/schema";
import { getRepostedVoteIds } from "./utils/reposts";

export function handleVoteCast(event: VoteCast): void {
  let proposalId = event.params.proposalId.toString();
  let accountId = event.params.voter.toHexString();
  let voteId = accountId.concat("-").concat(proposalId);

  let proposal = Proposal.load(proposalId);

  if (proposal == null) {
    proposal = new Proposal(proposalId);
    proposal.save();
  }

  let account = Account.load(accountId);

  if (account == null) {
    account = new Account(accountId);
    account.save();
  }

  let vote = new Vote(voteId);

  vote.proposal = proposal.id;
  vote.account = account.id;
  vote.votes = event.params.votes;
  vote.support = event.params.support;
  vote.blockNumber = event.block.number;
  vote.blockTimestamp = event.block.timestamp;

  if (event.params.reason != "") {
    vote.reason = event.params.reason;
  }

  let previousVotes = proposal.votes.load();
  vote.repostedVotes = getRepostedVoteIds(vote, previousVotes);

  vote.save();
}
