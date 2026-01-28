# ralph.sh
# Usage: ./ralph.sh <iterations>

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

# For each iteration, run Claude Code with the following prompt.
# This prompt is basic, we'll expand it later.
for ((i=1; i<=$1; i++)); do
  echo ""
  echo "════════════════════════════════════════════════════════════════"
  echo "                    ▶▶▶ ITERATION $i/$1 ◀◀◀"
  echo "════════════════════════════════════════════════════════════════"
  echo ""

  issues=$(gh issue list --state open --json number,title,body,comments)

  result=$(claude -p "$issues @progress.txt @plans/backlog/prompt.md")

  echo "$result"

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "PRD complete, exiting."
    exit 0
  fi
done
