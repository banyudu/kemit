#!/usr/bin/env node

import branch from 'git-branch'
import { spawn } from 'child_process'
import gitLog from 'git-log'

const commitMsgRegex = /^\[(需求|缺陷)\]\[(\d+)\]/

const getRequirementID = async () => {
  try {
    const branchName = branch.sync();
    // 如果符合 feat/123/xxx 的格式，就返回 123
    const match = branchName.match(/^feat\/(\d+)\/.+/);
    if (match) {
      return match[1] ?? null;
    }

    // 如果不符合 feat/123/xxx 的格式，则尝试回溯 git log 中历史 commit 的 message
    const logs = await gitLog({})
    for (const log of logs) {
      const match = log.subject.match(commitMsgRegex);
      if (match) {
        return match[2] ?? null;
      }
    }
  } catch (error) {
    return null
  }
}

/**
 * 修改 argv 中的 commit message
 */
const parseArgv = async () => {
  const requirementId = await getRequirementID();
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

const main = async () => {
  await parseArgv()

  spawn('git', ['commit', ...process.argv.slice(2)], { stdio: 'inherit' })
}

main().catch(console.error)