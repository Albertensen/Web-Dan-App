"use client";

import React, { useState, useCallback } from 'react';

interface VoteControlProps {
  threadId: string;
  initialVotes?: number;
}

const VoteControl: React.FC<VoteControlProps> = ({ threadId, initialVotes = 0 }) => {
  const [votes, setVotes] = useState(initialVotes);
  // userVote: 1 (up), -1 (down), 0 (none)
  const [userVote, setUserVote] = useState<0 | 1 | -1>(0);

  const handleVote = useCallback((dir: 1 | -1) => {
    let newVotes: number;
    let newUserVote: 0 | 1 | -1;

    if (userVote === dir) {
      // Reset vote
      newVotes = votes - userVote;
      newUserVote = 0;
    } else {
      // Change or set vote
      newVotes = votes - userVote + dir;
      newUserVote = dir;
    }

    setVotes(newVotes);
    setUserVote(newUserVote);

    // Simulate API call
    console.log("vote", threadId, dir);
  }, [votes, userVote, threadId]);

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Up Button */}
      <button
        onClick={() => handleVote(1)}
        className={`text-xl p-2 rounded transition-colors ${
          userVote === 1 ? "text-blue-400" : "text-slate-500 hover:text-blue-400"
        }`}
        aria-label="Upvote"
      >
        ▲
      </button>

      {/* Vote Count */}
      <span className="text-sm font-semibold text-slate-200">
        {votes}
      </span>

      {/* Down Button */}
      <button
        onClick={() => handleVote(-1)}
        className={`text-xl p-2 rounded transition-colors ${
          userVote === -1 ? "text-red-400" : "text-slate-500 hover:text-red-400"
        }`}
        aria-label="Downvote"
      >
        ▼
      </button>
    </div>
  );
};

export default VoteControl;