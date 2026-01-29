#!/bin/bash

issues=$(gh issue list --state open --json number,title,body,comments)

claude --permission-mode acceptEdits "$issues @progress.txt @plans/backlog/prompt.md"
