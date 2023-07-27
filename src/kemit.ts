#!/usr/bin/env node

import branch from 'git-branch'
import { spawn } from 'child_process'

const commitMsgRegex = /^\[(需求|缺陷)\]\[\d+\]/

const getRequirementID = () => {
  try {
    const branchName = branch.sync();
    // 如果符合 feat/123/xxx 的格式，就返回 123
    const match = branchName.match(/^feat\/(\d+)\/.+/);
    if (match) {
      return match[1] ?? null;
    }
  } catch (error) {
    return null
  }
}

/**
 * 修改 argv 中的 commit message
 */
const parseArgv = () => {
  const requirementId = getRequirementID();
  if (!requirementId) {
    return
  }

  const mIndex = process.argv.indexOf('-m');
  if (mIndex !== -1 && mIndex + 1 < process.argv.length) {
    // Add branch name as prefix to -m value
    if (!commitMsgRegex.test(process.argv[mIndex + 1])) {
      process.argv[mIndex + 1] = `[需求][${requirementId}] ${process.argv[mIndex + 1]}`;
    }
  }
}

parseArgv()

spawn('git', ['commit', ...process.argv.slice(2)], { stdio: 'inherit' })