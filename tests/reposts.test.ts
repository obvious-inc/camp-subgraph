import {
  assert,
  clearStore,
  test,
  describe,
  afterEach,
} from "matchstick-as/assembly/index";
import { BigInt } from "@graphprotocol/graph-ts";
import { Proposal, Vote } from "../generated/schema";
import { getRepostedVoteIds } from "../src/utils/reposts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000001";

const createRepostQuote = (string: string): string =>
  `+1\n\n${string
    .split("\n")
    .map<String>((line: string): string => `> ${line}`)
    .join("\n")}`;

function initVoteWithDefaults(id: string): Vote {
  let vote = new Vote(id);
  vote.support = 1;
  vote.votes = BigInt.fromI32(0);
  vote.account = ZERO_ADDRESS;
  vote.blockNumber = BigInt.fromI32(1);
  vote.blockTimestamp = BigInt.fromI32(1);
  return vote;
}

afterEach(() => {
  clearStore();
});

describe("reposts", () => {
  test("finds single repost", () => {
    let proposal = new Proposal("1");
    proposal.save();
    let targetVote = initVoteWithDefaults("1");
    targetVote.reason = "foo";
    targetVote.proposal = proposal.id;
    targetVote.save();
    let vote = initVoteWithDefaults("2");
    vote.reason = "Yes!\n\n+1\n\n> foo";
    vote.proposal = proposal.id;
    vote.save();

    const voteIds = getRepostedVoteIds(vote, [targetVote]);

    assert.assertTrue(
      voteIds.length === 1,
      `Vote id count ${voteIds.length} !== 1`,
    );
    assert.assertTrue(voteIds[0] === "1");
  });

  test("finds multiple reposts", () => {
    let proposal = new Proposal("1");
    proposal.save();
    let targetVote1 = initVoteWithDefaults("1");
    targetVote1.reason = "foo";
    targetVote1.proposal = proposal.id;
    targetVote1.save();
    let targetVote2 = initVoteWithDefaults("2");
    targetVote2.reason = `bar\n\n${createRepostQuote(targetVote1.reason!)}`;
    targetVote2.proposal = proposal.id;
    targetVote2.save();
    let vote = initVoteWithDefaults("3");
    vote.reason = `Yes!\n\n${createRepostQuote(targetVote1.reason!)}\n\n${createRepostQuote(targetVote2.reason!)}`;
    vote.proposal = proposal.id;
    vote.save();

    const voteIds = getRepostedVoteIds(vote, [targetVote1, targetVote2]);

    assert.assertTrue(
      voteIds.length === 2,
      `Vote id count ${voteIds.length} !== 2`,
    );
    assert.assertTrue(voteIds[0] === "1");
    assert.assertTrue(voteIds[1] === "2");
  });
});
